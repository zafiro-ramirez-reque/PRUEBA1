const carrito = document.getElementById('carrito');
const carritoLista = document.getElementById('carrito-lista');
const total = document.getElementById('total');
const cerrarCarrito = document.getElementById('cerrar-carrito');
const iconoCarrito = document.getElementById('icono-carrito');

let productosEnCarrito = [];

document.querySelectorAll('.agregar-carrito').forEach(boton => {
  boton.addEventListener('click', (e) => {
    const producto = e.target.closest('.producto');
    const nombre = producto.dataset.nombre;
    const precio = parseFloat(producto.dataset.precio);
    const existente = productosEnCarrito.find(p => p.nombre === nombre);
    if (existente) {
      existente.cantidad++;
    } else {
      productosEnCarrito.push({ nombre, precio, cantidad: 1 });
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
  let totalCompra = 0;
  productosEnCarrito.forEach((producto, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}
      <button onclick="eliminarProducto(${index})">Eliminar</button>
    `;
    carritoLista.appendChild(li);
    totalCompra += producto.precio * producto.cantidad;
  });
  total.textContent = `Total: $${totalCompra.toFixed(2)}`;
}

function eliminarProducto(index) {
  productosEnCarrito.splice(index, 1);
  actualizarCarrito();
}
