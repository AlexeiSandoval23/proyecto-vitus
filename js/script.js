const productos = [
    { id: 1, nombre: "Poleron Vitus", categoria: "Ropa Superior", precio: 18000, img: "img/poleron.jpg" },
    { id: 2, nombre: "Polera Vitus", categoria: "Ropa Superior", precio: 38000, img: "img/polera.jpg" },
    { id: 3, nombre: "Chaqueta Cortaviento", categoria: "Abrigos", precio: 55000, img: "img/chaqueta.jpg" },
    { id: 4, nombre: "Zapatillas Urbanas", categoria: "Calzado", precio: 48000, img: "img/zapatilla.jpg" },
    { id: 5, nombre: "Gorro Vitus", categoria: "Ropa Superior", precio: 21000, img: "img/gorro.jpg" },
    { id: 6, nombre: "Pantalón de Buzo", categoria: "Pantalones", precio: 29000, img: "img/pantalon.jpg" }
];


let carrito = JSON.parse(localStorage.getItem('carritoVitus')) || [];


const productContainer = document.getElementById('product-container');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const clearCartBtn = document.getElementById('clear-cart-btn');

/**
 * 
 * @param {Array} listaProductos 
 */
function renderizarProductos(listaProductos) {
    productContainer.innerHTML = ''; 

    listaProductos.forEach(producto => {
        const card = document.createElement('div');
        card.classList.add('product-card');
        card.innerHTML = `
            <img src="${producto.img}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>$${producto.precio.toLocaleString('es-CL')}</p>
            <button class="add-to-cart-btn" data-id="${producto.id}">Agregar al carrito</button>
        `;
        productContainer.appendChild(card);
    });

  
    productContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-cart-btn')) {
            const productoId = parseInt(event.target.getAttribute('data-id'));
            agregarAlCarrito(productoId);
        }
    });
}

/**
 * 
 * @param {number} productoId
 */
function agregarAlCarrito(productoId) {
    const itemExistente = carrito.find(item => item.id === productoId);

    if (itemExistente) {
        itemExistente.cantidad++;
    } else {
        const productoAAgregar = productos.find(p => p.id === productoId);
        if (productoAAgregar) {
            carrito.push({ ...productoAAgregar, cantidad: 1 });
        }
    }
    
    mostrarNotificacion(`${itemExistente ? 'Cantidad actualizada' : 'Producto agregado'}: ${productos.find(p => p.id === productoId).nombre}`);

    actualizarCarrito();
}

/**
 * 
 * @param {number} productoId
 */
function eliminarDelCarrito(productoId) {
    const itemIndex = carrito.findIndex(item => item.id === productoId);

    if (itemIndex !== -1) {
        const item = carrito[itemIndex];
        if (item.cantidad > 1) {
            item.cantidad--;
             mostrarNotificacion(`Cantidad reducida: ${item.nombre}`);
        } else {
            carrito.splice(itemIndex, 1);
            mostrarNotificacion(`Producto eliminado: ${item.nombre}`);
        }
        actualizarCarrito(); 
    }
}


function vaciarCarrito() {
   
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
        carrito = [];
        actualizarCarrito(); 
        mostrarNotificacion("Carrito vaciado.");
    }
}

function actualizarCarrito() {
    renderizarItemsCarrito();
    actualizarContadorYTotal();
    guardarCarritoEnStorage();
    actualizarVisibilidadCarrito();
}


function renderizarItemsCarrito() {
    cartItemsContainer.innerHTML = ''; 

    if (carrito.length > 0) {
        carrito.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.nombre} (x${item.cantidad})</span>
                <span>$${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                <button class="remove-item-btn" data-id="${item.id}">Quitar</button>
            `;
            cartItemsContainer.appendChild(li);
        });
    }
}


function actualizarContadorYTotal() {
    const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    const totalPrecio = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

    cartCount.textContent = totalItems;
    cartTotal.textContent = totalPrecio.toLocaleString('es-CL');
}


function actualizarVisibilidadCarrito() {
    if (carrito.length === 0) {
        emptyCartMsg.classList.remove('hidden');
        cartItemsContainer.innerHTML = '';
        clearCartBtn.classList.add('hidden');
    } else {
        emptyCartMsg.classList.add('hidden'); 
        clearCartBtn.classList.remove('hidden');
    }
}

function guardarCarritoEnStorage() {
    localStorage.setItem('carritoVitus', JSON.stringify(carrito));
}

/**
 *
 * @param {string} mensaje 
 */
function mostrarNotificacion(mensaje) {
 
    const notificacion = document.createElement('div');
    notificacion.classList.add('notification'); 
    notificacion.textContent = mensaje;


    document.body.appendChild(notificacion);

    notificacion.style.position = 'fixed';
    notificacion.style.bottom = '20px';
    notificacion.style.left = '50%';
    notificacion.style.transform = 'translateX(-50%)';
    notificacion.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    notificacion.style.color = 'white';
    notificacion.style.padding = '10px 20px';
    notificacion.style.borderRadius = '5px';
    notificacion.style.zIndex = '1000';


    setTimeout(() => {
        notificacion.remove();
    }, 2500);
}





cartItemsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-item-btn')) {
        const productoId = parseInt(event.target.getAttribute('data-id'));
        eliminarDelCarrito(productoId);
    }
});

clearCartBtn.addEventListener('click', vaciarCarrito);


document.addEventListener('DOMContentLoaded', () => {
    console.log("Vitus Store - DOM listo.");
    renderizarProductos(productos);
    actualizarCarrito(); 
});