tsParticles.load("tsparticles", {
    fullScreen: {
        enable: true,
        zIndex: -1
    },
    background: {
        color: "#000000"
    },
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                area: 800
            }
        },
        color: {
            value: "#ffffff"
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: { min: 0.1, max: 0.8 },
            animation: {
                enable: true,
                speed: 0.5,
                sync: false
            }
        },
        size: {
            value: { min: 0.5, max: 2 },
            animation: {
                enable: false
            }
        },
        move: {
            enable: true,
            speed: 0.2,
            direction: "none",
            random: true,
            straight: false,
            outModes: {
                default: "out"
            }
        },
        twinkle: {
            particles: {
                enable: true,
                frequency: 0.05,
                opacity: 1
            }
        },
        links: {
            enable: false
        }
    },
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "repulse"
            }
        },
        modes: {
            repulse: {
                distance: 100,
                duration: 0.4
            }
        }
    },
    detectRetina: true
});