document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("searchInput");

    if (!input) return; // por si el input no existe aún

    const baseText = "¿QUÉ ESTÁS BUSCANDO?: ";
    const words = ["COMIDA", "MASCOTAS", "ANIMALES", "FUNDACIONES"];

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typingSpeed = 100;
    const deletingSpeed = 60;
    const waitAfterTyping = 1500;

    function typeEffect() {
        const currentWord = words[wordIndex];

        if (!isDeleting) {
            charIndex++;
            input.placeholder = baseText + currentWord.substring(0, charIndex);

            if (charIndex === currentWord.length) {
                setTimeout(() => (isDeleting = true), waitAfterTyping);
            }
        } else {
            charIndex--;
            input.placeholder = baseText + currentWord.substring(0, charIndex);

            if (charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
        }

        setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
    }

    typeEffect();
});