const botonesAgregar = document.querySelectorAll('.producto button');
const carritoLista = document.getElementById('carrito-lista');
const totalSpan = document.getElementById('total');
const finalizarCompra = document.getElementById('finalizar-compra');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const carritoContenedor = document.getElementById('carrito');

let carrito = [];

botonesAgregar.forEach(boton => {
  boton.addEventListener('click', () => {
    const producto = boton.parentElement;
    const nombre = producto.querySelector('p').textContent;
    const precioTexto = producto.querySelectorAll('p')[1].textContent;
    const precio = parseFloat(precioTexto.replace('S/ ', ''));

    agregarAlCarrito(nombre, precio);
    mostrarCarrito();
  });
});

function agregarAlCarrito(nombre, precio) {
  const existente = carrito.find(p => p.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, cantidad: 1 });
  }
  actualizarCarrito();
}

function actualizarCarrito() {
  carritoLista.innerHTML = '';

  let total = 0;

  carrito.forEach((producto, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <span><strong>${producto.nombre}</strong></span>
      <span>Precio: S/ ${producto.precio.toFixed(2)}</span>
      <span>Cantidad: ${producto.cantidad}</span>
      <button onclick="cambiarCantidad(${index}, 1)">+</button>
      <button onclick="cambiarCantidad(${index}, -1)">-</button>
      <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    carritoLista.appendChild(li);
    total += producto.precio * producto.cantidad;
  });

  totalSpan.textContent = total.toFixed(2);

  if (carrito.length === 0) {
    const li = document.createElement('li');
    li.textContent = 'Carrito vacío';
    carritoLista.appendChild(li);
  }
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }
  actualizarCarrito();
}

function eliminarProducto(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function mostrarCarrito() {
  carritoContenedor.classList.remove('oculto');
}

cerrarCarrito.addEventListener('click', () => {
  carritoContenedor.classList.add('oculto');
});

finalizarCompra.addEventListener('click', () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
    return;
  }
  // Redirige a la página de checkout (puedes personalizar esta lógica)
  window.location.href = 'checkout.html';
});
