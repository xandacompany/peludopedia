document.addEventListener("DOMContentLoaded", () => {
    // --- Perros ---
    const enlacePerros = document.getElementById("id-enlace-perros");
    const audioPerros = new Audio("./src/assets/sounds/perros.wav");

    enlacePerros.addEventListener("click", (e) => {
    e.preventDefault();
    audioPerros.currentTime = 0;
    audioPerros.play();
    audioPerros.onended = () => {
        window.location.href = enlacePerros.href;
    };
    });

    // --- Gatos ---
    const enlaceGatos = document.getElementById("id-enlace-gatos");
    const audioGatos = new Audio("./src/assets/sounds/gatos.wav");

    enlaceGatos.addEventListener("click", (e) => {
    e.preventDefault();
    audioGatos.currentTime = 0;
    audioGatos.play();
    audioGatos.onended = () => {
        window.location.href = enlaceGatos.href;
    };
    });

    // --- Pájaros ---
    const enlacePajaros = document.getElementById("id-enlace-pajaros");
    const audioPajaros = new Audio("./src/assets/sounds/pajaros.wav");

    enlacePajaros.addEventListener("click", (e) => {
    e.preventDefault();
    audioPajaros.currentTime = 0;
    audioPajaros.play();
    audioPajaros.onended = () => {
        window.location.href = enlacePajaros.href;
    };
    });
});