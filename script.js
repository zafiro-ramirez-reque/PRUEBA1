
const buscador = document.getElementById("buscador");
const productos = document.querySelectorAll(".producto");
const botonesAgregar = document.querySelectorAll(".btn-agregar");
const iconoUsuario = document.getElementById("icono-usuario");
const ventanaUsuario = document.getElementById("ventana-usuario");
const iconoCarrito = document.getElementById("icono-carrito");
const pasarelaPago = document.getElementById("pasarela-pago");
const cartCount = document.getElementById("cart-count");

let carritoItems = [];


buscador.addEventListener("input", () => {
  const termino = buscador.value.toLowerCase();
  productos.forEach(p => {
    const nombre = p.dataset.nombre.toLowerCase();
    p.style.display = nombre.includes(termino) ? "block" : "none";
  });
});


iconoUsuario.addEventListener("click", () => {
  ventanaUsuario.classList.toggle("oculto");
});


function mostrarFormulario(tipo) {
  const registro = document.getElementById("formulario-registro");
  const login = document.getElementById("formulario-login");
  if (tipo === "registro") {
    registro.classList.remove("oculto");
    login.classList.add("oculto");
  } else {
    login.classList.remove("oculto");
    registro.classList.add("oculto");
  }
}


botonesAgregar.forEach((btn, index) => {
  btn.addEventListener("click", () => {
    const producto = productos[index];
    const nombre = producto.dataset.nombre;
    const precio = parseFloat(producto.dataset.precio);

    const existente = carritoItems.find(item => item.nombre === nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      carritoItems.push({ nombre, precio, cantidad: 1 });
    }
    actualizarContador();
  });
});

function actualizarContador() {
  const total = carritoItems.reduce((acc, item) => acc + item.cantidad, 0);
  cartCount.textContent = total;
}


iconoCarrito.addEventListener("click", () => {
  pasarelaPago.classList.remove("oculto");
});

function cerrarPasarela() {
  pasarelaPago.classList.add("oculto");
}

function finalizarCompra() {
  alert("¡Gracias por tu compra! 🛍️");
  carritoItems = [];
  actualizarContador();
  cerrarPasarela();
}
