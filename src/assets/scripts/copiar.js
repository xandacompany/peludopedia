const shareBtn = document.getElementById("id-compartir-encabezado");
const popup = document.getElementById("sharePopup");
const cards = document.querySelectorAll(".share-card");
const url = encodeURIComponent(window.location.href);

shareBtn.addEventListener("click", (e) => {
    e.stopPropagation();

    popup.classList.add("active");
    popup.style.visibility = "hidden"; // para medir sin mostrar

    requestAnimationFrame(() => {
        const popupRect = popup.getBoundingClientRect();
        const btnRect = shareBtn.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        let left = btnRect.left + (btnRect.width / 2) - (popupRect.width / 2);

        // Evitar overflow derecho
        if (left + popupRect.width > viewportWidth - 8) {
            left = viewportWidth - popupRect.width - 8;
        }

        // Evitar overflow izquierdo
        if (left < 8) {
            left = 8;
        }

        popup.style.left = `${left - btnRect.left}px`;
        popup.style.visibility = "visible";
    });
});

document.addEventListener("click", () => {
    popup.classList.remove("active");
});

cards.forEach(card => {
    card.addEventListener("click", () => {
        const action = card.dataset.action;

        switch (action) {
            case "copy":
                navigator.clipboard.writeText(window.location.href);
                alert("URL copiada al portapapeles");
                break;
            case "whatsapp":
                window.open(`https://wa.me/?text=${url}`, "_blank");
                break;
            case "email":
                window.location.href = `mailto:?subject=Compartir enlace&body=${url}`;
                break;
            case "facebook":
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank");
                break;
            case "telegram":
                window.open(`https://t.me/share/url?url=${url}`, "_blank");
                break;
        }

        popup.classList.remove("active");
    });
});