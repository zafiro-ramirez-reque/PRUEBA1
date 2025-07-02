document.addEventListener("DOMContentLoaded", () => {
  const searchBar = document.getElementById("search-bar");
  const productos = document.querySelectorAll(".producto");

  // Filtro en vivo desde el buscador
  if (searchBar) {
    searchBar.addEventListener("input", (e) => {
      const query = e.target.value.toLowerCase();
      productos.forEach((producto) => {
        const nombre = producto.querySelector("h3").textContent.toLowerCase();
        producto.style.display = nombre.includes(query) ? "block" : "none";
      });
    });
  }

  // Lógica básica para botones de categoría (puedes expandirlo si das clases a cada producto)
  const botonesCategoria = document.querySelectorAll(".categorias button");
  botonesCategoria.forEach((boton) => {
    boton.addEventListener("click", () => {
      const categoria = boton.textContent.toLowerCase();
      alert(`Filtro por categoría: ${categoria}`);
      // Aquí podrías filtrar usando clases CSS si las agregas en HTML.
    });
  });
});
// Guardar producto en localStorage
function agregarAlCarrito(nombre, precio) {
  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const index = carrito.findIndex(item => item.nombre === nombre);
  if (index !== -1) {
    carrito[index].cantidad += 1;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
  alert(`${nombre} agregado al carrito`);
}

