// Carrito funcional mejorado con persistencia localStorage
const productos = document.querySelectorAll(".producto");
const carritoLista = document.getElementById("carrito-lista");
const totalElemento = document.getElementById("total");
const carrito = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const botonCarrito = document.querySelector('.icons a[title="Carrito"]');

let carritoItems = [];

// Cargar desde localStorage al iniciar
const datosGuardados = localStorage.getItem("carrito");
if (datosGuardados) {
  carritoItems = JSON.parse(datosGuardados);
  actualizarCarrito();
}

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

    guardarCarrito();
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
      <button class="cantidad-btn" onclick="cambiarCantidad(${index}, -1)" aria-label="Restar cantidad">-</button>
      ${item.cantidad}
      <button class="cantidad-btn" onclick="cambiarCantidad(${index}, 1)" aria-label="Sumar cantidad">+</button>
      <button class="eliminar-btn" onclick="eliminarItem(${index})" aria-label="Eliminar producto">✕</button>
    `;
    carritoLista.appendChild(li);
  });

  const total = carritoItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  totalElemento.textContent = `Total: $${total.toFixed(2)}`;
  guardarCarrito();
}

function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carritoItems));
}

// Funciones globales para cambiar cantidad o eliminar
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

// Cerrar carrito
cerrarCarrito.addEventListener("click", () => {
  carrito.classList.add("oculto");
});

// 🔍 Búsqueda de productos en tiempo real
const buscador = document.getElementById("buscador");

buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();

  productos.forEach(producto => {
    const nombre = producto.dataset.nombre.toLowerCase();
    if (nombre.includes(texto)) {
      producto.style.display = "flex";
    } else {
      producto.style.display = "none";
    }
  });
});
