const productos = document.querySelectorAll(".producto");
const carritoLista = document.getElementById("carrito-lista");
const totalElemento = document.getElementById("total");
const carrito = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const iconoCarrito = document.getElementById("icono-carrito");
const iconoUsuario = document.getElementById("icono-usuario");
const iconoFavoritos = document.getElementById("icono-favoritos");
const buscador = document.getElementById("buscador");
const ventanaUsuario = document.getElementById("ventana-usuario");
const ventanaCarrito = document.getElementById("ventana-carrito");
const ventanaPasarela = document.getElementById("ventana-pasarela");
const tabs = document.querySelectorAll(".tabs button");
const formularios = document.querySelectorAll(".formulario");

let carritoItems = [];

productos.forEach(producto => {
  producto.querySelector("button").addEventListener("click", () => {
    const nombre = producto.dataset.nombre;
    const precio = parseFloat(producto.dataset.precio);

    const existente = carritoItems.find(item => item.nombre === nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      carritoItems.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
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

  // Actualizar contador
  const contador = document.getElementById("cart-count");
  const totalCantidad = carritoItems.reduce((acc, item) => acc + item.cantidad, 0);
  contador.textContent = totalCantidad;
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

iconoCarrito.addEventListener("click", () => {
  ventanaPasarela.classList.toggle("oculto");
});

cerrarCarrito.addEventListener("click", () => {
  carrito.classList.add("oculto");
});

iconoUsuario.addEventListener("click", () => {
  ventanaUsuario.classList.toggle("oculto");
});

iconoFavoritos.addEventListener("click", () => {
  alert("Funcionalidad de favoritos próximamente disponible.");
});

tabs.forEach((tab, i) => {
  tab.addEventListener("click", () => {
    formularios.forEach(f => f.classList.add("oculto"));
    formularios[i].classList.remove("oculto");
  });
});

buscador.addEventListener("input", e => {
  const termino = e.target.value.toLowerCase();
  productos.forEach(producto => {
    const nombre = producto.dataset.nombre.toLowerCase();
    producto.style.display = nombre.includes(termino) ? "flex" : "none";
  });
});

// Simulación del envío de formulario de compra
const btnPasarela = document.getElementById("enviar-compra");
if (btnPasarela) {
  btnPasarela.addEventListener("click", () => {
    alert("Gracias por su compra.");
    ventanaPasarela.classList.add("oculto");
    carritoItems = [];
    actualizarCarrito();
  });
}
