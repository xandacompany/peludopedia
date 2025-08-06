window.addEventListener('scroll', function (){
  const contenedor = document.querySelector("header");
  if(window.scrollY > 10){
    contenedor.classList.add("fixed-header");
  }
  else{
    contenedor.classList.remove("fixed-header");
  }
});