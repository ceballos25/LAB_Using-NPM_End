tsParticles.load("tsparticles", {
    background: {
        color: "#000000"
    },
    fullScreen: {
        enable: true,
        zIndex: -1
    },
    particles: {
        number: {
            value: 150
        },
        color: {
            value: ["#00bfff", "#00ff7f", "#ffffff"]
        },
        shape: {
            type: "circle"
        },
        opacity: {
            value: 0.3
        },
        size: {
            value: { min: 1, max: 3 }
        },
        move: {
            enable: true,
            speed: 0.3,
            outModes: {
                default: "bounce"
            }
        },
        links: {
            enable: true,
            distance: 150,
            color: "#ffffff",
            opacity: 0.2,
            width: 1
        }
    },
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "grab"
            }
        },
        modes: {
            grab: {
                distance: 150,
                links: {
                    opacity: 0.5
                }
            }
        }
    }
});
