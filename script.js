const productos = document.querySelectorAll(".producto");
const carritoLista = document.getElementById("carrito-lista");
const totalElemento = document.getElementById("total");
const carrito = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const finalizarCompraBtn = document.getElementById("finalizar-compra");
const iconoUsuario = document.getElementById("icono-usuario");
const menuUsuario = document.getElementById("menu-usuario");

let carritoItems = [];

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
  totalElemento.textContent = total.toFixed(2);
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

finalizarCompraBtn?.addEventListener("click", () => {
  window.location.href = "pasarela.html";
});

// Menú usuario desplegable
iconoUsuario?.addEventListener("click", () => {
  menuUsuario.classList.toggle("oculto");
});

document.addEventListener("click", (e) => {
  if (!menuUsuario.contains(e.target) && !iconoUsuario.contains(e.target)) {
    menuUsuario.classList.add("oculto");
  }
});
