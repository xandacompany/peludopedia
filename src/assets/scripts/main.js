window.addEventListener('scroll', function () {
  const header = document.querySelector("header");

  if (window.scrollY > 10) {
    header.classList.add("fixed-header");
  } else {
    header.classList.remove("fixed-header");
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const contenedores = [
    document.getElementById('id-contenedor-tarjetas-tendencias'),
    document.getElementById('id-contenedor-tarjetas-videos')
  ];

  contenedores.forEach(contenedor => {
    if (!contenedor) return; // Evita errores si el id no existe

    let isDown = false;
    let startX;
    let scrollLeft;

    contenedor.addEventListener('mousedown', (e) => {
      isDown = true;
      contenedor.classList.add('active');
      startX = e.pageX - contenedor.offsetLeft;
      scrollLeft = contenedor.scrollLeft;
    });

    contenedor.addEventListener('mouseleave', () => {
      isDown = false;
      contenedor.classList.remove('active');
    });

    contenedor.addEventListener('mouseup', () => {
      isDown = false;
      contenedor.classList.remove('active');
    });

    contenedor.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - contenedor.offsetLeft;
      const walk = (x - startX) * 4; // Ajusta velocidad del desplazamiento
      contenedor.scrollLeft = scrollLeft - walk;
    });
  });
});