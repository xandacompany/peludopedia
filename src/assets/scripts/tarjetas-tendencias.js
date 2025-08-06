document.addEventListener("DOMContentLoaded", () =>{
    fetch('./src/assets/json/tarjetas.json')

    .then(personas => personas.json())
    .then(datos => {
        const contenedor = document.getElementById('id-contenedor-tarjetas-tendencias');

        datos.tendencias.forEach(funcionflecha =>{
            const tarjeta = document.createElement("div");
            tarjeta.classList.add("tarjetas");

            const contenedorimagen = document.createElement("div");
            contenedorimagen.classList.add("contenedor-imagen-tarjeta");

            const imagen = document.createElement("img");
            imagen.classList.add("imagen-tarjeta");
            imagen.src = funcionflecha.miniatura;
            imagen.alt = funcionflecha.titulo;
            imagen.title = funcionflecha.titulo;

            const contenedorpuntos = document.createElement("div");
            contenedorpuntos.classList.add("contenedor-puntos-tarjeta");

            for(let i=0; i < 3; i++){
                const punto = document.createElement("div");
                punto.classList.add("puntos-tarjeta");
                contenedorpuntos.appendChild(punto);
            }

            const contenedorinformacion = document.createElement("div");
            contenedorinformacion.classList.add("contenedor-informacion-tarjeta");

            const titulo = document.createElement("p");
            titulo.classList.add("titulo-tarjeta");
            titulo.textContent = funcionflecha.titulo;

            const descripcion = document.createElement("p");
            descripcion.classList.add("descripcion-tarjeta");
            descripcion.textContent = funcionflecha.descripcion;

            const boton = document.createElement("a");
            boton.classList.add("boton-tarjeta");
            boton.href = funcionflecha.enlace;
            boton.textContent = "LEER MÁS";

            tarjeta.appendChild(contenedorimagen);
            contenedorimagen.appendChild(imagen);
            contenedorimagen.appendChild(contenedorpuntos);

            tarjeta.appendChild(contenedorinformacion);
            contenedorinformacion.appendChild(titulo);
            contenedorinformacion.appendChild(descripcion);
            contenedorinformacion.appendChild(boton);

            contenedor.appendChild(tarjeta);
        })
        .catch(error => console.error("Error al cargar el JSON:", error));
    });
});