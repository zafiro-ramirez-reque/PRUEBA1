// script.js

document.addEventListener('DOMContentLoaded', function () {
  const botonesAgregar = document.querySelectorAll('.producto button');
  const carritoLista = document.getElementById('carrito-lista');
  const totalTexto = document.getElementById('total');
  const carrito = document.getElementById('carrito');
  const iconoCarrito = document.getElementById('icono-carrito');
  const cerrarCarrito = document.getElementById('cerrar-carrito');

  let carritoItems = [];

  botonesAgregar.forEach(boton => {
    boton.addEventListener('click', () => {
      const producto = boton.parentElement;
      const nombre = producto.getAttribute('data-nombre');
      const precio = parseFloat(producto.getAttribute('data-precio'));

      const existente = carritoItems.find(item => item.nombre === nombre);
      if (existente) {
        existente.cantidad++;
      } else {
        carritoItems.push({ nombre, precio, cantidad: 1 });
      }

      actualizarCarrito();
    });
  });

  iconoCarrito.addEventListener('click', () => {
    carrito.classList.toggle('oculto');
  });

  cerrarCarrito.addEventListener('click', () => {
    carrito.classList.add('oculto');
  });

  function actualizarCarrito() {
    carritoLista.innerHTML = '';
    let total = 0;

    carritoItems.forEach((item, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        ${item.nombre} x${item.cantidad} - $${(item.precio * item.cantidad).toFixed(2)}
        <button onclick="cambiarCantidad(${index}, 1)">+</button>
        <button onclick="cambiarCantidad(${index}, -1)">-</button>
        <button onclick="eliminarItem(${index})">🗑️</button>
      `;
      carritoLista.appendChild(li);
      total += item.precio * item.cantidad;
    });

    totalTexto.textContent = `Total: $${total.toFixed(2)}`;
  }

  window.cambiarCantidad = function (index, cambio) {
    carritoItems[index].cantidad += cambio;
    if (carritoItems[index].cantidad <= 0) {
      carritoItems.splice(index, 1);
    }
    actualizarCarrito();
  };

  window.eliminarItem = function (index) {
    carritoItems.splice(index, 1);
    actualizarCarrito();
  };
});
