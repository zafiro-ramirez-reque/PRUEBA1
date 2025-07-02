// Variables
const carrito = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const iconoCarrito = document.querySelector('a[title="Carrito"]');
const listaCarrito = document.getElementById("carrito-lista");
const totalTexto = document.getElementById("total");

let productosCarrito = [];

// Mostrar carrito
iconoCarrito.addEventListener("click", () => {
  carrito.style.display = "flex";
});

// Cerrar carrito
cerrarCarrito.addEventListener("click", () => {
  carrito.style.display = "none";
});

// Simulación de agregar productos
function agregarProducto(nombre, precio) {
  const existente = productosCarrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    productosCarrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarrito();
}

// Actualizar vista del carrito
function actualizarCarrito() {
  listaCarrito.innerHTML = "";
  let total = 0;

  productosCarrito.forEach((producto, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${producto.nombre} - $${(producto.precio * producto.cantidad).toFixed(2)} <br>
      <button onclick="cambiarCantidad(${index}, -1)">-</button>
      ${producto.cantidad}
      <button onclick="cambiarCantidad(${index}, 1)">+</button>
      <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;

    listaCarrito.appendChild(li);
    total += producto.precio * producto.cantidad;
  });

  totalTexto.textContent = `Total: $${total.toFixed(2)}`;
}

// Cambiar cantidad
function cambiarCantidad(index, cambio) {
  productosCarrito[index].cantidad += cambio;
  if (productosCarrito[index].cantidad <= 0) {
    productosCarrito.splice(index, 1);
  }
  actualizarCarrito();
}

// Eliminar producto
function eliminarProducto(index) {
  productosCarrito.splice(index, 1);
  actualizarCarrito();
}

// Prueba: agregar producto simulado al hacer clic (puedes borrar esto si tienes un sistema real)
document.addEventListener("DOMContentLoaded", () => {
  // Simulación de clic en un producto
  setTimeout(() => {
    agregarProducto("Labial Mate", 25.00);
    agregarProducto("Mascarilla Facial", 18.50);
  }, 1000); // Se agregan automáticamente después de 1 segundo solo como prueba
});
