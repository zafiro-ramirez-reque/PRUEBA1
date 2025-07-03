// Carrito funcional mejorado
const productos = document.querySelectorAll(".producto");
const carritoLista = document.getElementById("carrito-lista");
const totalElemento = document.getElementById("total");
const carrito = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const botonCarrito = document.querySelector('.icons a[title="Carrito"]');

let carritoItems = [];

// Escuchar clicks en los botones "Agregar al carrito"
productos.forEach(producto => {
  const boton = producto.querySelector("button");
  boton.addEventListener("click", () => {
    const nombre = producto.dataset.nombre;
    const precio = parseFloat(producto.dataset.precio);

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

// Botón del carrito para abrir/cerrar
botonCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  carrito.classList.toggle("oculto");
});

function actualizarCarrito() {
  carritoLista.innerHTML = "";

  if (carritoItems.length === 0) {
    carritoLista.innerHTML = "<li>Carrito vacío</li>";
    totalElemento.textContent = "Total: $0.00";
    return;
  }

  carritoItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(2)} x 
      <button class="cantidad-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
      ${item.cantidad}
      <button class="cantidad-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
      <button class="eliminar-btn" onclick="eliminarItem(${index})">✕</button>
    `;
    carritoLista.appendChild(li);
  });

  const total = carritoItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  totalElemento.textContent = `Total: $${total.toFixed(2)}`;
}

// Añade estos al global scope para que puedan ser llamados desde los botones del HTML
window.cambiarCantidad = function(index, cambio) {
  carritoItems[index].cantidad += cambio;
  if (carritoItems[index].cantidad <= 0) {
    carritoItems.splice(index, 1);
  }
  actualizarCarrito();
};

window.eliminarItem = function(index) {
  carritoItems.splice(index, 1);
  actualizarCarrito();
};

// Cerrar carrito al hacer click en el botón
cerrarCarrito.addEventListener("click", () => {
  carrito.classList.add("oculto");
});
