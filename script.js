// Carrito funcional mejorado para ambas páginas
document.addEventListener('DOMContentLoaded', function() {
    // Selectores comunes
    const carritoLista = document.getElementById("carrito-lista");
    const totalElemento = document.getElementById("total");
    const carrito = document.getElementById("carrito");
    const cerrarCarrito = document.getElementById("cerrar-carrito");
    const botonCarrito = document.querySelector('.icons a[title="Carrito"], .icons a[title="Carrito de compras"]');
    const botonFavoritos = document.querySelector('.icons a[title="Favoritos"]');
    const favoritosContenedor = document.getElementById("favoritos");
    const cerrarFavoritos = document.getElementById("cerrar-favoritos");
    const favoritosLista = document.getElementById("favoritos-lista");
    const buscador = document.getElementById("buscador");
    const filtros = document.querySelectorAll('.filtros input[type="checkbox"]');

    // Elementos que pueden variar entre páginas
    const productos = document.querySelectorAll(".producto");
    const btnAgregarCarritos = document.querySelectorAll(".agregar-carrito, .producto > button");

    let carritoItems = [];
    let favoritos = [];

    // Inicialización
    init();

    function init() {
        cargarDatos();
        configurarEventosProductos();
        configurarEventListenersGlobales();
    }

    function cargarDatos() {
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
    }

    function configurarEventosProductos() {
        // Para productos en cabello.html (con clase agregar-carrito)
        document.querySelectorAll(".agregar-carrito").forEach(btn => {
            btn.addEventListener("click", agregarProductoAlCarrito);
        });

        // Para productos en index.html (button directo)
        document.querySelectorAll(".producto > button").forEach(btn => {
            if (!btn.classList.contains("agregar-carrito") && 
                !btn.classList.contains("agregar-favorito")) {
                btn.addEventListener("click", agregarProductoAlCarrito);
            }
        });

        // Eventos para favoritos
        document.querySelectorAll(".agregar-favorito").forEach(btn => {
            btn.addEventListener("click", toggleFavorito);
        });
    }

    function agregarProductoAlCarrito(e) {
        const btn = e.currentTarget;
        const producto = btn.closest(".producto");
        
        const nombre = btn.dataset.nombre || 
                      producto.dataset.nombre || 
                      producto.querySelector("h4, p")?.textContent?.split("-")[0]?.trim();
        
        const precioText = btn.dataset.precio || 
                         producto.dataset.precio || 
                         producto.querySelector("p")?.textContent?.match(/\d+\.?\d*/);
        
        const precio = parseFloat(precioText);

        if (!nombre || isNaN(precio)) {
            console.error("No se pudo identificar el producto:", {nombre, precio});
            return;
        }

        const existente = carritoItems.find(item => item.nombre === nombre);
        if (existente) {
            existente.cantidad++;
        } else {
            carritoItems.push({ nombre, precio, cantidad: 1 });
        }

        guardarCarrito();
        actualizarCarrito();
        if (carrito) carrito.classList.remove("oculto");
    }

    function toggleFavorito(e) {
        const btn = e.currentTarget;
        const producto = btn.closest(".producto");
        
        const nombre = btn.dataset.nombre || 
                      producto.dataset.nombre || 
                      producto.querySelector("h4, p")?.textContent?.split("-")[0]?.trim();
        
        const precioText = btn.dataset.precio || 
                         producto.dataset.precio || 
                         producto.querySelector("p")?.textContent?.match(/\d+\.?\d*/);
        
        const precio = parseFloat(precioText);

        if (!nombre || isNaN(precio)) {
            console.error("Datos incompletos para favorito:", {nombre, precio});
            return;
        }

        const existente = favoritos.find(p => p.nombre === nombre);
        if (existente) {
            favoritos = favoritos.filter(p => p.nombre !== nombre);
            btn.classList.remove("favorito");
        } else {
            favoritos.push({ nombre, precio });
            btn.classList.add("favorito");
        }

        guardarFavoritos();
        actualizarFavoritos();
    }

    function marcarFavoritosEnProductos() {
        document.querySelectorAll(".agregar-favorito").forEach(btn => {
            const producto = btn.closest(".producto");
            if (!producto) return;
            
            const nombre = btn.dataset.nombre || 
                          producto.dataset.nombre || 
                          producto.querySelector("h4, p")?.textContent?.split("-")[0]?.trim();
            
            if (!nombre) return;

            if (favoritos.some(fav => fav.nombre === nombre)) {
                btn.classList.add("favorito");
            } else {
                btn.classList.remove("favorito");
            }
        });
    }

    function configurarEventListenersGlobales() {
        // Carrito
        if (botonCarrito) {
            botonCarrito.addEventListener("click", (e) => {
                e.preventDefault();
                if (carrito) carrito.classList.toggle("oculto");
            });
        }

        if (cerrarCarrito) {
            cerrarCarrito.addEventListener("click", () => {
                if (carrito) carrito.classList.add("oculto");
            });
        }

        // Favoritos
        if (botonFavoritos) {
            botonFavoritos.addEventListener("click", (e) => {
                e.preventDefault();
                if (favoritosContenedor) favoritosContenedor.classList.toggle("oculto");
            });
        }

        if (cerrarFavoritos) {
            cerrarFavoritos.addEventListener("click", () => {
                if (favoritosContenedor) favoritosContenedor.classList.add("oculto");
            });
        }

        // Buscador
        if (buscador) {
            buscador.addEventListener("input", () => {
                const texto = buscador.value.toLowerCase();
                document.querySelectorAll(".producto").forEach(producto => {
                    const nombre = producto.dataset.nombre?.toLowerCase() || 
                                 producto.querySelector("h4, p")?.textContent?.toLowerCase() || "";
                    producto.style.display = nombre.includes(texto) ? "" : "none";
                });
            });
        }

        // Filtros
        if (filtros.length > 0) {
            filtros.forEach(filtro => {
                filtro.addEventListener("change", aplicarFiltros);
            });
        }
    }

    function aplicarFiltros() {
        const marcasSeleccionadas = [...document.querySelectorAll('input[name="marca"]:checked')].map(el => el.value);
        const preciosSeleccionados = [...document.querySelectorAll('input[name="precio"]:checked')].map(el => el.value);

        document.querySelectorAll(".producto").forEach(producto => {
            const marca = producto.dataset.marca;
            const precioText = producto.dataset.precio || 
                             producto.querySelector("p")?.textContent?.match(/\d+\.?\d*/);
            const precio = parseFloat(precioText);

            const pasaMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(marca);
            const pasaPrecio = preciosSeleccionados.length === 0 ||
                (preciosSeleccionados.includes("menor-20") && precio < 20) ||
                (preciosSeleccionados.includes("mayor-20") && precio >= 20);

            producto.style.display = (pasaMarca && pasaPrecio) ? "" : "none";
        });
    }

    // Funciones de actualización
    function actualizarCarrito() {
        if (!carritoLista) return;

        carritoLista.innerHTML = "";

        if (carritoItems.length === 0) {
            carritoLista.innerHTML = "<li>Carrito vacío</li>";
            if (totalElemento) totalElemento.textContent = "Total: $0.00";
            return;
        }

        carritoItems.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.nombre} - $${item.precio.toFixed(2)} x 
                <button class="cantidad-btn" data-index="${index}" data-change="-1">-</button>
                ${item.cantidad}
                <button class="cantidad-btn" data-index="${index}" data-change="1">+</button>
                <button class="eliminar-btn" data-index="${index}">✕</button>
            `;
            carritoLista.appendChild(li);
        });

        // Agregar eventos a los nuevos botones
        carritoLista.querySelectorAll(".cantidad-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                const change = parseInt(this.dataset.change);
                cambiarCantidad(index, change);
            });
        });

        carritoLista.querySelectorAll(".eliminar-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                eliminarItem(index);
            });
        });

        const total = carritoItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        if (totalElemento) totalElemento.textContent = `Total: $${total.toFixed(2)}`;
    }

    function actualizarFavoritos() {
        if (!favoritosLista) return;

        favoritosLista.innerHTML = "";
        if (favoritos.length === 0) {
            favoritosLista.innerHTML = "<li>No tienes productos favoritos.</li>";
            return;
        }

        favoritos.forEach((item, index) => {
            const li = document.createElement("li");
            li.innerHTML = `
                ${item.nombre} - $${item.precio.toFixed(2)}
                <button class="agregar-favorito-carrito" data-index="${index}">🛒</button>
                <button class="eliminar-favorito-btn" data-index="${index}">✕</button>
            `;
            favoritosLista.appendChild(li);
        });

        // Agregar eventos a los nuevos botones
        favoritosLista.querySelectorAll(".agregar-favorito-carrito").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                agregarFavoritoAlCarrito(index);
            });
        });

        favoritosLista.querySelectorAll(".eliminar-favorito-btn").forEach(btn => {
            btn.addEventListener("click", function() {
                const index = parseInt(this.dataset.index);
                eliminarFavorito(index);
            });
        });
    }

    // Funciones de guardado
    function guardarCarrito() {
        localStorage.setItem("carrito", JSON.stringify(carritoItems));
    }

    function guardarFavoritos() {
        localStorage.setItem("favoritos", JSON.stringify(favoritos));
    }

    // Funciones de manipulación
    function cambiarCantidad(index, cambio) {
        carritoItems[index].cantidad += cambio;
        if (carritoItems[index].cantidad <= 0) {
            carritoItems.splice(index, 1);
        }
        guardarCarrito();
        actualizarCarrito();
    }

    function eliminarItem(index) {
        carritoItems.splice(index, 1);
        guardarCarrito();
        actualizarCarrito();
    }

    function agregarFavoritoAlCarrito(index) {
        const item = favoritos[index];
        const existente = carritoItems.find(p => p.nombre === item.nombre);
        if (existente) {
            existente.cantidad++;
        } else {
            carritoItems.push({ ...item, cantidad: 1 });
        }
        guardarCarrito();
        actualizarCarrito();
        if (carrito) carrito.classList.remove("oculto");
    }

    function eliminarFavorito(index) {
        favoritos.splice(index, 1);
        guardarFavoritos();
        actualizarFavoritos();
        marcarFavoritosEnProductos();
    }

    // Hacer funciones accesibles globalmente
    window.cambiarCantidad = cambiarCantidad;
    window.eliminarItem = eliminarItem;
    window.agregarFavoritoAlCarrito = agregarFavoritoAlCarrito;
    window.eliminarFavorito = eliminarFavorito;
});
