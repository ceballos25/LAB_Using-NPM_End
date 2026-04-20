let pokemonActual = null;
let = CLAVE_FAVORITOS_STORAGE = 'favoritos'

const btnFavorito = document.getElementById('btnFavorito')
const divResultado = document.getElementById('resultado');
const divListaFavoritos = document.getElementById('listaFavoritos');
const btnBuscar = document.getElementById('btnBuscar');
btnBuscar.addEventListener('click', searchPokemon);
btnFavorito.addEventListener('click', guardarFavorito);


function showAlert({ type, message }) {
    Swal.fire({
        toast: true,
        position: 'top',
        icon: type,
        title: message,
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
    });
}


function searchPokemon() {
    const nombre = document.getElementById('pokemonInput').value.toLowerCase().trim();

    // console.log("Buscando pokemon:", nombre);

    if (!nombre) {
        showAlert({
            type: 'error',
            message: 'Por favor escribe un nombre de pokemon'
        });
        return;
    }

    const url = `https://pokeapi.co/api/v2/pokemon/${nombre}`;

    // console.log(" URL:", url);

    fetch(url)
        .then(function (response) {
            // console.log("respuesta:", response.status, response.ok);

            if (!response.ok) {
                throw new Error("pokemon no encontrado");
            }
            return response.json();
        })
        .then(function (data) {
            // console.log("datos de  la API:", data);

            pokemonActual = {
                nombre: data.name,
                imagen: data.sprites.front_default
            };

            // console.log("pokemonActual:", pokemonActual);

            // console.log("url imagen:", pokemonActual.imagen);
            showAlert({
                type: 'success',
                message: '¡pokemon Encontrado!'
            });

            mostrarPokemon(pokemonActual);

        })
        .catch(function (error) {
            // console.error("error en la petición:", error);

            showAlert({
                type: 'error',
                message: '¡pokemon no encontrado!'
            });

            if (divResultado) {
                divResultado.innerHTML =
                    '<p style="color:red;">Pokémon no encontrado. Intenta con otro nombre.</p>';
            }

            // btnFavorito.style.display = 'none';
            pokemonActual = null;
        });
}

// Luis ok
function mostrarPokemon(pokemon) {
    document.getElementById("contenedorPokemon").style.display = "block";

    document.getElementById("imagen").innerHTML = `<img src="${pokemon.imagen}" width="180" alt="${pokemon.nombre}">`;
    document.getElementById("nombre").innerHTML = pokemon.nombre.toUpperCase();
}

// Lucelly
function pokemonFavoritos() {
    const favoritesCards = document.querySelector(".favorites-cards");
    favoritesCards.innerHTML = "";

    const favoritos = obtenerFavoritosGuardados();

    favoritos.forEach(function (pokemon) {
        const div = document.createElement("div");
        div.classList.add("favorites-card-box");
        div.innerHTML = `
            <p class="favorites__title">${pokemon.nombre.toUpperCase()}</p>
            <div class="favorites__img">
                <img src="${pokemon.imagen}" alt="${pokemon.nombre}">
            </div>
            <button class="search-box__button-search favorites__button-delete">Eliminar</button>
        `;

        const btnEliminar = div.querySelector(".favorites__button-delete");
        btnEliminar.addEventListener("click", function () {
            eliminarFavorito(pokemon.nombre);
        });

        favoritesCards.appendChild(div);
    });
}

function eliminarFavorito(nombre) {
    const favoritos = obtenerFavoritosGuardados();
    const nuevosFavoritos = favoritos.filter(function (pokemon) {
        return pokemon.nombre !== nombre;
    });
    localStorage.setItem(CLAVE_FAVORITOS_STORAGE, JSON.stringify(nuevosFavoritos));
    pokemonFavoritos();
}

// funcion auxiliar para guardar favorito
function obtenerFavoritosGuardados() {
    const favoritosGuardados = localStorage.getItem(CLAVE_FAVORITOS_STORAGE);
    if (favoritosGuardados === null) {
        return [];
    }
    return JSON.parse(favoritosGuardados);
}

// Fernando
function guardarFavorito() {
    if (pokemonActual === null) {
        showAlert({
            type: 'error',
            message: 'Por favor escribe un nombre de pokemon'
        });
        return;
    }
    const listaFavoritosActual = obtenerFavoritosGuardados();
    const pokemonYaExisteEnFavoritos = listaFavoritosActual.some(function (pokemonFavorito) {
        return pokemonFavorito.nombre === pokemonActual.nombre;
    });

    if (pokemonYaExisteEnFavoritos) {
        showAlert({
            type: 'error',
            message: 'éste pokemos ya existe'
        });
        return;
    }
    listaFavoritosActual.push(pokemonActual);
    localStorage.setItem(
        CLAVE_FAVORITOS_STORAGE,
        JSON.stringify(listaFavoritosActual)
    );
    showAlert({
        type: 'success',
        message: '¡Guardado en la lista de favoritos!'
    });
    pokemonFavoritos();

}

// Debe llamarse al cargar siempre la pàgina
pokemonFavoritos()