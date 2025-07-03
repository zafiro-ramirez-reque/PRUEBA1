document.addEventListener("DOMContentLoaded", () => {
  const botonesAgregar = document.querySelectorAll(".agregar-carrito");
  const carritoLista = document.getElementById("carrito-lista");
  const totalSpan = document.getElementById("total");
  const botonCarrito = document.getElementById("icono-carrito");
  const carritoEmergente = document.getElementById("carrito");
  const cerrarCarrito = document.getElementById("cerrar-carrito");

  let carrito = [];

  botonesAgregar.forEach(boton => {
    boton.addEventListener("click", (e) => {
      const producto = e.target.closest(".producto");
      const nombre = producto.dataset.nombre;
      const precio = parseFloat(producto.dataset.precio);

      const existente = carrito.find(item => item.nombre === nombre);
      if (existente) {
        existente.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }
      actualizarCarrito();
    });
  });

  function actualizarCarrito() {
    carritoLista.innerHTML = "";

    let total = 0;

    carrito.forEach((item, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${item.nombre} - $${item.precio} x ${item.cantidad}
        <div>
          <button onclick="cambiarCantidad(${index}, -1)">-</button>
          <button onclick="cambiarCantidad(${index}, 1)">+</button>
          <button onclick="eliminarItem(${index})">x</button>
        </div>
      `;
      carritoLista.appendChild(li);
      total += item.precio * item.cantidad;
    });

    totalSpan.textContent = `Total: $${total.toFixed(2)}`;
  }

  window.cambiarCantidad = (index, cambio) => {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
    actualizarCarrito();
  };

  window.eliminarItem = (index) => {
    carrito.splice(index, 1);
    actualizarCarrito();
  };

  botonCarrito.addEventListener("click", () => {
    carritoEmergente.classList.add("mostrar");
  });

  cerrarCarrito.addEventListener("click", () => {
    carritoEmergente.classList.remove("mostrar");
  });
});
