document.addEventListener("DOMContentLoaded", () => {
    fetch('./src/assets/json/frases.json')
        .then(objeto => objeto.json())
        .then(datos => {
            const contenedor = document.getElementById("id-contenedor-frases");

            const totalFrases = datos.frases.length;

            const hoy = new Date();
            const inicioDelAño = new Date(hoy.getFullYear(), 0, 0);
            const diferencia = hoy - inicioDelAño;
            const unDia = 1000 * 60 * 60 * 24;
            const numeroDia = Math.floor(diferencia / unDia);

            const indice = numeroDia % totalFrases;
            const fraseDelDia = datos.frases[indice].frase;

            const comillas_uno = document.createElement("span");
            comillas_uno.textContent = '"';

            const frase = document.createElement("p");
            frase.textContent = fraseDelDia;

            const comillas_dos = document.createElement("span");
            comillas_dos.textContent = '"';

            contenedor.appendChild(comillas_uno);
            contenedor.appendChild(frase);
            contenedor.appendChild(comillas_dos);
        })
        .catch(error => console.error("Error al cargar el JSON:", error));
});