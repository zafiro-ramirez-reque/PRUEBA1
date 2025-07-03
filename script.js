// Carrito funcional mejorado con persistencia localStorage y favoritos
const productos = document.querySelectorAll(".producto");
const carritoLista = document.getElementById("carrito-lista");
const totalElemento = document.getElementById("total");
const carrito = document.getElementById("carrito");
const cerrarCarrito = document.getElementById("cerrar-carrito");
const botonCarrito = document.querySelector('.icons a[title="Carrito"]');
const botonFavoritos = document.querySelector('.icons a[title="Favoritos"]');
const favoritosContenedor = document.getElementById("favoritos");
const cerrarFavoritos = document.getElementById("cerrar-favoritos");
const favoritosLista = document.getElementById("favoritos-lista");
const buscador = document.getElementById("buscador");
const filtros = document.querySelectorAll('.filtros input[type="checkbox"]');

let carritoItems = [];
let favoritos = [];

// Cargar desde localStorage al iniciar
const datosGuardados = localStorage.getItem("carrito");
if (datosGuardados) {
  carritoItems = JSON.parse(datosGuardados);
  actualizarCarrito();
}

const datosFavoritos = localStorage.getItem("favoritos");
if (datosFavoritos) {
  favoritos = JSON.parse(datosFavoritos);
  actualizarFavoritos();
  marcarFavoritosEnProductos();
}

// Manejo de agregar al carrito
productos.forEach(producto => {
  const btnCarrito = producto.querySelector(".agregar-carrito");
  const btnFavorito = producto.querySelector(".agregar-favorito");

  if (btnCarrito) {
    btnCarrito.addEventListener("click", () => {
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
  }

  if (btnFavorito) {
    btnFavorito.addEventListener("click", () => {
      const nombre = producto.dataset.nombre;
      const precio = parseFloat(producto.dataset.precio);
      const existente = favoritos.find(p => p.nombre === nombre);

      if (existente) {
        favoritos = favoritos.filter(p => p.nombre !== nombre);
        btnFavorito.classList.remove("favorito");
      } else {
        favoritos.push({ nombre, precio });
        btnFavorito.classList.add("favorito");
      }

      guardarFavoritos();
      actualizarFavoritos();
    });
  }
});

// Marcar favoritos al cargar
function marcarFavoritosEnProductos() {
  productos.forEach(producto => {
    const nombre = producto.dataset.nombre;
    const btn = producto.querySelector(".agregar-favorito");
    if (btn && favoritos.some(fav => fav.nombre === nombre)) {
      btn.classList.add("favorito");
    }
  });
}

// Mostrar/ocultar carrito
botonCarrito.addEventListener("click", (e) => {
  e.preventDefault();
  carrito.classList.toggle("oculto");
});

cerrarCarrito.addEventListener("click", () => {
  carrito.classList.add("oculto");
});

// Mostrar/ocultar favoritos
botonFavoritos.addEventListener("click", (e) => {
  e.preventDefault();
  favoritosContenedor.classList.toggle("oculto");
});

cerrarFavoritos.addEventListener("click", () => {
  favoritosContenedor.classList.add("oculto");
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
      <button class="cantidad-btn" onclick="cambiarCantidad(${index}, -1)">-</button>
      ${item.cantidad}
      <button class="cantidad-btn" onclick="cambiarCantidad(${index}, 1)">+</button>
      <button class="eliminar-btn" onclick="eliminarItem(${index})">✕</button>
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

function guardarFavoritos() {
  localStorage.setItem("favoritos", JSON.stringify(favoritos));
}

function actualizarFavoritos() {
  favoritosLista.innerHTML = "";
  if (favoritos.length === 0) {
    favoritosLista.innerHTML = "<li>No tienes productos favoritos.</li>";
    return;
  }
  favoritos.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${item.nombre} - $${item.precio.toFixed(2)}
      <button onclick="agregarFavoritoAlCarrito(${index})">🛒</button>
      <button onclick="eliminarFavorito(${index})">✕</button>
    `;
    favoritosLista.appendChild(li);
  });
}

window.agregarFavoritoAlCarrito = function(index) {
  const item = favoritos[index];
  const existente = carritoItems.find(p => p.nombre === item.nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carritoItems.push({ ...item, cantidad: 1 });
  }
  guardarCarrito();
  actualizarCarrito();
  carrito.classList.remove("oculto");
};

window.eliminarFavorito = function(index) {
  favoritos.splice(index, 1);
  guardarFavoritos();
  actualizarFavoritos();
  marcarFavoritosEnProductos();
};

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

// Buscador
buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  productos.forEach(producto => {
    const nombre = producto.dataset.nombre?.toLowerCase() || "";
    producto.style.display = nombre.includes(texto) ? "block" : "none";
  });
});

// Filtros marca y precio
filtros.forEach(filtro => {
  filtro.addEventListener("change", aplicarFiltros);
});

function aplicarFiltros() {
  const marcasSeleccionadas = [...document.querySelectorAll('input[name="marca"]:checked')].map(el => el.value);
  const preciosSeleccionados = [...document.querySelectorAll('input[name="precio"]:checked')].map(el => el.value);

  productos.forEach(producto => {
    const marca = producto.dataset.marca;
    const precio = parseFloat(producto.dataset.precio);

    const pasaMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(marca);
    const pasaPrecio = preciosSeleccionados.length === 0 ||
      (preciosSeleccionados.includes("menor-20") && precio < 20) ||
      (preciosSeleccionados.includes("mayor-20") && precio >= 20);

    producto.style.display = (pasaMarca && pasaPrecio) ? "block" : "none";
  });
}

