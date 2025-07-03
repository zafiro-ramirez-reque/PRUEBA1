document.addEventListener("DOMContentLoaded", function () {
  const botonesAgregar = document.querySelectorAll(".producto button");
  const carritoLista = document.getElementById("carrito-lista");
  const totalElemento = document.getElementById("total");
  const carritoContenedor = document.getElementById("carrito");
  const cerrarCarrito = document.getElementById("cerrar-carrito");
  const iconoCarrito = document.getElementById("icono-carrito");

  let carrito = [];

  function actualizarCarrito() {
    carritoLista.innerHTML = "";
    let total = 0;

    carrito.forEach((producto, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${producto.nombre} - $${producto.precio.toFixed(2)} x ${producto.cantidad}
        <div>
          <button onclick="cambiarCantidad(${index}, 1)">+</button>
          <button onclick="cambiarCantidad(${index}, -1)">-</button>
          <button onclick="eliminarProducto(${index})">Eliminar</button>
        </div>
      `;
      carritoLista.appendChild(li);
      total += producto.precio * producto.cantidad;
    });

    totalElemento.textContent = `Total: $${total.toFixed(2)}`;
  }

  window.cambiarCantidad = function (index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
      carrito.splice(index, 1);
    }
    actualizarCarrito();
  };

  window.eliminarProducto = function (index) {
    carrito.splice(index, 1);
    actualizarCarrito();
  };

  botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
      const productoDiv = boton.closest(".producto");
      const nombre = productoDiv.dataset.nombre;
      const precio = parseFloat(productoDiv.dataset.precio);

      const existente = carrito.find(p => p.nombre === nombre);
      if (existente) {
        existente.cantidad++;
      } else {
        carrito.push({ nombre, precio, cantidad: 1 });
      }

      actualizarCarrito();
      carritoContenedor.style.display = "flex";
    });
  });

  cerrarCarrito.addEventListener("click", () => {
    carritoContenedor.style.display = "none";
  });

  iconoCarrito.addEventListener("click", () => {
    carritoContenedor.style.display = carritoContenedor.style.display === "flex" ? "none" : "flex";
  });
});
