document.addEventListener("DOMContentLoaded", () => {
    fetch('./src/assets/json/tarjetas.json')
        .then(response => response.json())
        .then(datos => {
            const contenedor = document.getElementById('id-contenedor-tarjetas-tendencias');

            datos.tendencias.forEach(funcionflecha => {
                // Tarjeta principal
                const tarjeta = document.createElement("div");
                tarjeta.classList.add("tarjetas");

                // Contenedor imagen
                const contenedorimagen = document.createElement("div");
                contenedorimagen.classList.add("contenedor-imagen-tarjeta");

                const imagen = document.createElement("img");
                imagen.classList.add("imagen-tarjeta");
                imagen.src = funcionflecha.miniatura;
                imagen.alt = funcionflecha.titulo;
                imagen.title = funcionflecha.titulo;

                // Contenedor puntos
                const contenedorpuntos = document.createElement("div");
                contenedorpuntos.classList.add("contenedor-puntos-tarjeta");

                for (let i = 0; i < 3; i++) {
                    const punto = document.createElement("div");
                    punto.classList.add("puntos-tarjeta");
                    contenedorpuntos.appendChild(punto);
                }

                // ===== MENU DESPLEGABLE =====
                const menu = document.createElement("div");
                menu.classList.add("menu-tarjeta");
                menu.style.display = "none";

                // Opción Compartir
                const opcionCompartir = document.createElement("div");
                opcionCompartir.classList.add("opcion-menu-tarjeta");
                opcionCompartir.innerHTML = `
                    <span class="mini-menu-opciones">
                        <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.47 4.13998C12.74 4.35998 12.28 5.96 12.09 7.91C6.77997 7.91 2 13.4802 2 20.0802C4.19 14.0802 8.99995 12.45 12.14 12.45C12.34 14.21 12.79 15.6202 13.47 15.8202C15.57 16.4302 22 12.4401 22 9.98006C22 7.52006 15.57 3.52998 13.47 4.13998Z" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Compartir
                    </span>
                `;

                opcionCompartir.addEventListener("click", (e) => {
                    e.stopPropagation();

                    navigator.clipboard.writeText(funcionflecha.enlace)
                        .then(() => {
                            console.log("Enlace copiado:", funcionflecha.enlace);
                            // opcional: feedback visual
                            opcionCompartir.innerText = "Copiado";
                            setTimeout(() => {
                                opcionCompartir.innerHTML = `
                        <span class="mini-menu-opciones">
                            <svg viewBox="-0.5 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.47 4.13998C12.74 4.35998 12.28 5.96 12.09 7.91C6.77997 7.91 2 13.4802 2 20.0802C4.19 14.0802 8.99995 12.45 12.14 12.45C12.34 14.21 12.79 15.6202 13.47 15.8202C15.57 16.4302 22 12.4401 22 9.98006C22 7.52006 15.57 3.52998 13.47 4.13998Z"
                                stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                            Compartir
                        </span>
                        `;
                            }, 1500);
                        })
                        .catch(err => {
                            console.error("Error al copiar el enlace:", err);
                        });
                });


                // Opción Guardar
                const opcionGuardar = document.createElement("div");
                opcionGuardar.classList.add("opcion-menu-tarjeta");
                opcionGuardar.innerHTML = `
                    <span class="mini-menu-opciones">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12.89 5.87988H5.10999C3.39999 5.87988 2 7.27987 2 8.98987V20.3499C2 21.7999 3.04 22.4199 4.31 21.7099L8.23999 19.5199C8.65999 19.2899 9.34 19.2899 9.75 19.5199L13.68 21.7099C14.95 22.4199 15.99 21.7999 15.99 20.3499V8.98987C16 7.27987 14.6 5.87988 12.89 5.87988Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M16 8.98987V20.3499C16 21.7999 14.96 22.4099 13.69 21.7099L9.76001 19.5199C9.34001 19.2899 8.65999 19.2899 8.23999 19.5199L4.31 21.7099C3.04 22.4099 2 21.7999 2 20.3499V8.98987C2 7.27987 3.39999 5.87988 5.10999 5.87988H12.89C14.6 5.87988 16 7.27987 16 8.98987Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 5.10999V16.47C22 17.92 20.96 18.53 19.69 17.83L16 15.77V8.98999C16 7.27999 14.6 5.88 12.89 5.88H8V5.10999C8 3.39999 9.39999 2 11.11 2H18.89C20.6 2 22 3.39999 22 5.10999Z" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        Guardar
                    </span>
                `;

                menu.appendChild(opcionCompartir);
                menu.appendChild(opcionGuardar);

                // Evento click en los puntos
                contenedorpuntos.addEventListener("click", (e) => {
                    e.stopPropagation();

                    // Cerrar otros menús
                    document.querySelectorAll(".menu-tarjeta").forEach(m => {
                        if (m !== menu) m.style.display = "none";
                    });

                    menu.style.display = menu.style.display === "none" ? "flex" : "none";
                });

                // Contenedor información
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

                // ===== ESTRUCTURA FINAL =====
                contenedorimagen.appendChild(imagen);
                contenedorimagen.appendChild(contenedorpuntos);

                tarjeta.appendChild(contenedorimagen);
                tarjeta.appendChild(menu);

                contenedorinformacion.appendChild(titulo);
                contenedorinformacion.appendChild(descripcion);
                contenedorinformacion.appendChild(boton);

                tarjeta.appendChild(contenedorinformacion);
                contenedor.appendChild(tarjeta);
            });

            // Cerrar menú al hacer click fuera
            document.addEventListener("click", () => {
                document.querySelectorAll(".menu-tarjeta").forEach(menu => {
                    menu.style.display = "none";
                });
            });
        })
        .catch(error => console.error("Error al cargar el JSON:", error));
});