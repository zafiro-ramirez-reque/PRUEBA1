function toggleFavorito(el) {
  el.classList.toggle("activo");
}

const productos = document.querySelectorAll(".producto button");
const carritoLista = document.getElementById("carrito-lista");
const totalElemento = document.getElementById("total");
const carrito = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const botonCarrito = document.querySelector('.icons a[title="Carrito"]');

let carritoItems = [];

productos.forEach(boton => {
  boton.addEventListener("click", () => {
    const producto = boton.closest(".producto");
    const nombre = producto.querySelector("h3").textContent;
    const precio = parseFloat(producto.querySelector("p").textContent.replace("$", ""));

    const existente = carritoItems.find(item => item.nombre === nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      carritoItems.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
    carrito.classList.remove("oculto");
  });
});

function actualizarCarrito() {
  carritoLista.innerHTML = "";

  carritoItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(2)} x 
      <button onclick="cambiarCantidad(${index}, -1)">➖</button>
      ${item.cantidad}
      <button onclick="cambiarCantidad(${index}, 1)">➕</button>
      <button onclick="eliminarItem(${index})">🗑️</button>
    `;
    carritoLista.appendChild(li);
  });

  const total = carritoItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  totalElemento.textContent = `Total: $${total.toFixed(2)}`;
}

function cambiarCantidad(index, cambio) {
  carritoItems[index].cantidad += cambio;
  if (carritoItems[index].cantidad <= 0) {
    carritoItems.splice(index, 1);
  }
  actualizarCarrito();
}

function eliminarItem(index) {
  carritoItems.splice(index, 1);
  actualizarCarrito();
}

cerrarCarrito.addEventListener("click", () => {
  carrito.classList.add("oculto");
});

botonCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  carrito.classList.toggle("oculto");
});

