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
