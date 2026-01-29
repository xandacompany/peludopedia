document.addEventListener("DOMContentLoaded", () =>{
    fetch('./src/assets/json/tarjetas.json')

    .then(personas => personas.json())
    .then(datos => {
        const contenedor = document.getElementById('id-contenedor-tarjetas-videos');

        datos.videos.forEach(funcionflecha =>{
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjetas-videos");

            const imagen = document.createElement("img");
            imagen.classList.add("tarjetas-videos-imagen");
            imagen.src = funcionflecha.miniatura;
            imagen.alt = funcionflecha.titulo;
            imagen.title = funcionflecha.titulo;

            const titulo = document.createElement("p");
            titulo.classList.add("tarjetas-videos-texto");
            titulo.textContent = funcionflecha.titulo;

            const contenedorpuntos = document.createElement("div");
            contenedorpuntos.classList.add("contenedor-puntos-tarjeta");

            for(let i=0; i < 3; i++){
                const punto = document.createElement("div");
                punto.classList.add("puntos-tarjeta");
                contenedorpuntos.appendChild(punto);
            }

            tarjeta.appendChild(imagen);
            tarjeta.appendChild(titulo);
            tarjeta.appendChild(contenedorpuntos);

            contenedor.appendChild(tarjeta);
        });
    })
    .catch(error => console.error("Error al cargar el JSON:", error));
});