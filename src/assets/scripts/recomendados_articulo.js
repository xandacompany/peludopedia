document.addEventListener("DOMContentLoaded", () => {
    fetch('/src/assets/json/tarjetas.json')
        .then(objeto => objeto.json())
        .then(datos => {
            const contenedor = document.getElementById("id-contenedor-tarjetas-recomedados");

            datos.tendencias
                .slice(0, 3)
                .forEach(funcionflecha => {
                    const tarjeta = document.createElement("div");
                    tarjeta.classList.add("tarjetas-recomedados");

                    const imagen = document.createElement("img");
                    imagen.src = funcionflecha.miniatura;
                    imagen.title = funcionflecha.titulo;
                    imagen.alt = funcionflecha.titulo;
                    imagen.classList.add("imagen-tarjeta-recomendaros");

                    const titulo = document.createElement("h4");
                    titulo.textContent = funcionflecha.titulo;
                    titulo.classList.add("texto-titulo-tarjeta-recomendados");

                    const descripcion = document.createElement("p");
                    descripcion.textContent = funcionflecha.descripcion;
                    descripcion.classList.add("texto-descripcion-tarjeta-recomendados");

                    const contenedor_textos = document.createElement("div");
                    contenedor_textos.classList.add("contenedor-textos-tarjeta-recomendados");

                    tarjeta.appendChild(imagen);
                    contenedor_textos.appendChild(titulo);
                    contenedor_textos.appendChild(descripcion);

                    tarjeta.appendChild(contenedor_textos);

                    contenedor.appendChild(tarjeta);
                });
        });
});