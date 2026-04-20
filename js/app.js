const API_KEY = 'P0QBoqf2HFKwDJ8HkPv3SNeSNdcHED6fkKizizCc';
const API_URL = 'https://api.nasa.gov/planetary/apod';
const CLAVE_FAVORITOS_STORAGE = 'apod_favoritos';

// ─── Estado ───────────────────────────────────────────────────────────────────
let apodActual = null;

// ─── Referencias DOM ──────────────────────────────────────────────────────────
const btnBuscar         = document.getElementById('btnBuscarApod');
const btnFavorito       = document.getElementById('btnAgregarApodFavorito');
const divResultado      = document.getElementById('resultadoApod');
const divListaFavoritos = document.getElementById('listaApodFavoritos');
const inputFecha        = document.getElementById('customDate');

// ─── Limitar el input de fecha al día de hoy ──────────────────────────────────
inputFecha.max = new Date().toISOString().split('T')[0];

// ─── Eventos ──────────────────────────────────────────────────────────────────
btnBuscar.addEventListener('click', buscarImagenDelDia);
btnFavorito.addEventListener('click', guardarFavorito);

// ─── Utilidades ───────────────────────────────────────────────────────────────
function showAlert({ type, message }) {
    Swal.fire({
        toast: true,
        position: 'top',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 2500,
        timerProgressBar: true
    });
}

function obtenerFavoritosGuardados() {
    const datos = localStorage.getItem(CLAVE_FAVORITOS_STORAGE);
    return datos ? JSON.parse(datos) : [];
}

function guardarEnStorage(favoritos) {
    localStorage.setItem(CLAVE_FAVORITOS_STORAGE, JSON.stringify(favoritos));
}

// ─── Buscar APOD ──────────────────────────────────────────────────────────────
function buscarImagenDelDia() {
    const fecha = inputFecha ? inputFecha.value : '';

    // Validar que no sea fecha futura
    if (fecha) {
        const hoy = new Date().toISOString().split('T')[0];
        if (fecha > hoy) {
            showAlert({ type: 'error', message: 'No puedes buscar fechas futuras' });
            return;
        }
    }

    const url = fecha
        ? `${API_URL}?api_key=${API_KEY}&date=${fecha}`
        : `${API_URL}?api_key=${API_KEY}`;

    divResultado.innerHTML = '<p>Cargando...</p>';
    // CORRECCIÓN: Ocultar el botón mientras carga
    btnFavorito.style.display = 'none';

    fetch(url)
        .then(function (response) {
            if (!response.ok) throw new Error('Error al conectar con la API de NASA');
            return response.json();
        })
        .then(function (data) {
            apodActual = {
                titulo:      data.title,
                fecha:       data.date,
                media:       data.media_type === 'video' ? data.url : data.hdurl || data.url,
                tipo:        data.media_type,
                descripcion: data.explanation
            };

            mostrarApod(apodActual);
            // CORRECCIÓN: Mostrar el botón solo cuando hay un APOD cargado
            btnFavorito.style.display = 'inline-block';
            showAlert({ type: 'success', message: '¡APOD cargado!' });
        })
        .catch(function (error) {
            console.error(error);
            divResultado.innerHTML = '<p style="color:red;">No se pudo obtener la imagen. Intenta con otra fecha.</p>';
            apodActual = null;
            btnFavorito.style.display = 'none';
            showAlert({ type: 'error', message: 'Error al obtener la APOD' });
        });
}

// ─── Mostrar APOD ─────────────────────────────────────────────────────────────
function mostrarApod(apod) {
    const mediaHTML = apod.tipo === 'video'
        ? `<iframe src="${apod.media}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`
        : `<img src="${apod.media}" alt="${apod.titulo}" style="max-width:100%; border-radius:8px;">`;

    divResultado.innerHTML = `
        <h2 style="color:#fff; margin-bottom:8px;">${apod.titulo}</h2>
        <p style="color:#aaa; margin-bottom:12px;"><strong>Fecha:</strong> ${apod.fecha}</p>
        ${mediaHTML}
        <p style="margin-top:12px; color:#ddd; line-height:1.6;">${apod.descripcion}</p>
    `;
}

// ─── Guardar favorito ─────────────────────────────────────────────────────────
function guardarFavorito() {
    if (!apodActual) {
        showAlert({ type: 'error', message: 'Primero busca una imagen' });
        return;
    }

    const favoritos = obtenerFavoritosGuardados();
    const yaExiste = favoritos.some(function (fav) {
        return fav.fecha === apodActual.fecha;
    });

    if (yaExiste) {
        showAlert({ type: 'error', message: 'Esta APOD ya está en favoritos' });
        return;
    }

    favoritos.push(apodActual);
    guardarEnStorage(favoritos);
    renderizarFavoritos();
    showAlert({ type: 'success', message: '¡Guardado en favoritos!' });
}

// ─── Renderizar lista de favoritos ────────────────────────────────────────────
function renderizarFavoritos() {
    const favoritos = obtenerFavoritosGuardados();
    divListaFavoritos.innerHTML = '';

    if (favoritos.length === 0) {
        divListaFavoritos.innerHTML = '<p style="color:#aaa;">No tienes favoritos guardados.</p>';
        return;
    }

    favoritos.forEach(function (apod) {
        const miniMedia = apod.tipo === 'video'
            ? `<div style="background:#000;color:#fff;padding:20px;text-align:center;border-radius:6px;">▶ Video</div>`
            : `<img src="${apod.media}" alt="${apod.titulo}" style="width:100%;height:120px;object-fit:cover;">`;

        const div = document.createElement('div');
        div.className = 'favorites-card-box';
        div.innerHTML = `
            ${miniMedia}
            <p style="font-weight:bold; margin:8px 8px 4px; color:#fff; font-size:0.85rem;">${apod.titulo}</p>
            <p style="font-size:0.75em; color:#aaa; margin:0 8px 8px;">${apod.fecha}</p>
            <div style="display:flex; gap:6px; justify-content:center; padding-bottom:10px;">
                <button class="btn-fav btn-cargar">Cargar</button>
                <button class="btn-fav btn-eliminar">Eliminar</button>
            </div>
        `;

        div.querySelector('.btn-cargar').addEventListener('click', function () {
            apodActual = apod;
            mostrarApod(apod);
            btnFavorito.style.display = 'inline-block';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        div.querySelector('.btn-eliminar').addEventListener('click', function (e) {
            e.stopPropagation();
            eliminarFavorito(apod.fecha);
        });

        divListaFavoritos.appendChild(div);
    });
}

// ─── Eliminar favorito ────────────────────────────────────────────────────────
function eliminarFavorito(fecha) {
    const favoritos = obtenerFavoritosGuardados();
    const nuevos = favoritos.filter(function (fav) {
        return fav.fecha !== fecha;
    });
    guardarEnStorage(nuevos);
    renderizarFavoritos();
    showAlert({ type: 'success', message: 'Favorito eliminado' });
}

// ─── Inicialización ────────────────────────────────────────────────────────────
// Cargar APOD del día al iniciar la página
buscarImagenDelDia();

// Renderizar favoritos guardados en localStorage
renderizarFavoritos();
