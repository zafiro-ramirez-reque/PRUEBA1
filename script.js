function toggleFavorito(el) {
  el.classList.toggle("activo");
}

const productos = document.querySelectorAll(".producto button");
const carritoLista = document.getElementById("carrito-lista");
const totalElemento = document.getElementById("total");
const carrito = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const botonCarrito = document.querySelector('.icons a[title="Carrito"]');
const finalizarCompraBtn = document.getElementById("finalizar-compra");

let carritoItems = [];

productos.forEach(boton => {
  boton.addEventListener("click", () => {
    const producto = boton.closest(".producto");
    const nombre = producto.querySelector("h3").textContent;
    const precio = parseFloat(producto.querySelector("p").textContent.replace("$", "").replace("S/.", ""));

    const existente = carritoItems.find(item => item.nombre === nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      carritoItems.push({ nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
    carrito.classList.remove("oculto");
    carrito.style.display = "block"; // Asegura que se muestre
  });
});

function actualizarCarrito() {
  carritoLista.innerHTML = "";

  carritoItems.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - S/.${item.precio.toFixed(2)} x 
      <button onclick="cambiarCantidad(${index}, -1)">➖</button>
      ${item.cantidad}
      <button onclick="cambiarCantidad(${index}, 1)">➕</button>
      <button onclick="eliminarItem(${index})">🗑️</button>
    `;
    carritoLista.appendChild(li);
  });

  const total = carritoItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  totalElemento.textContent = `Total: S/.${total.toFixed(2)}`;

  // Mostrar u ocultar el botón de finalizar compra
  finalizarCompraBtn.style.display = carritoItems.length > 0 ? "block" : "none";
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
  carrito.style.display = "none"; // También ocultarlo manualmente
});

botonCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  if (carrito.style.display === "block") {
    carrito.style.display = "none";
  } else {
    actualizarCarrito();
    carrito.style.display = "block";
    carrito.classList.remove("oculto");
  }
});

finalizarCompraBtn.addEventListener("click", () => {
  if (carritoItems.length > 0) {
    window.location.href = "checkout.html";
  } else {
    alert("Tu carrito está vacío.");
  }
});
