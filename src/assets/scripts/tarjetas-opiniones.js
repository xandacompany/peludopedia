document.addEventListener("DOMContentLoaded", () => {
    fetch('./src/assets/json/opiniones.json')
    .then(personas => personas.json())
    .then(datos => {
        const contenedor = document.getElementById('id-contenedor-opiniones');

        // Definir cuántas tarjetas mostrar según el ancho de pantalla
        let cantidad = 6; // valor por defecto
        const ancho = window.innerWidth;
        if(ancho >= 801 && ancho <= 900) {
            cantidad = 4;
        }

        datos.opiniones.slice(0, cantidad).forEach(funcionflecha => {
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjeta-opinion");

            const contenedorinformacion = document.createElement("div");
            contenedorinformacion.classList.add("tarjeta-opinion-informacion");

            const nombre = document.createElement("p");
            nombre.classList.add("tarjeta-opinion-nombre");
            nombre.textContent = funcionflecha.nombre;

            const titulo = document.createElement("p");
            titulo.classList.add("tarjeta-opinion-titulo");
            titulo.textContent = funcionflecha.titulo;

            const contenedorperfil = document.createElement("div");
            contenedorperfil.classList.add("tarjeta-opinion-perfil");

            const imagen = document.createElement("img");
            imagen.classList.add("tarjeta-opinion-imagen");
            imagen.src = funcionflecha.imagen;

            contenedorinformacion.appendChild(nombre);
            contenedorinformacion.appendChild(titulo);
            tarjeta.appendChild(contenedorinformacion);

            contenedorperfil.appendChild(imagen);
            tarjeta.appendChild(contenedorperfil);

            contenedor.appendChild(tarjeta);
        });
    })
    .catch(error => console.error("Error al cargar el JSON:", error));
});