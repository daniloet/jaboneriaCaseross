document.addEventListener('DOMContentLoaded', function () {
  const listaProductos = document.getElementById('lista-productos');
  const itemsCarritoPisos = document.getElementById('items-carrito-pisos');
  const itemsCarritoPlasticos = document.getElementById('items-carrito-plasticos');
  const itemsCarritoCloro = document.getElementById('items-carrito-cloro');
  const totalCarrito = document.getElementById('total-carrito');

  function cargarCarritoDesdeJSON() {
      return fetch('carrito.json')
          .then(response => response.json())
          .catch(error => {
              console.error('Error al cargar el carrito desde el JSON:', error);
              throw error;
          });
  }

  let productos;

  cargarCarritoDesdeJSON()
      .then(data => {
          productos = data;
          productos.forEach(producto => {
              const li = document.createElement('li');
              li.innerHTML = `${producto.nombre} - $${producto.precio.toFixed(2)} <button onclick="addToCart(${producto.id})">Agregar al carrito</button>`;
              listaProductos.appendChild(li);
          });
      })
      .catch(error => {
          console.error('Error al cargar el carrito desde el JSON:', error);
      });

  window.addToCart = function (productoId) {
      obtenerProductoPorId(productoId, productos)
          .then(productoSeleccionado => {
              const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
              carrito.push(productoSeleccionado);
              localStorage.setItem('carrito', JSON.stringify(carrito));
              updateCartDOM(itemsCarritoPisos, itemsCarritoPlasticos, itemsCarritoCloro, totalCarrito);
          })
          .catch(error => {
              console.error('Error al agregar al carrito:', error);
          });
  };

  function obtenerProductoPorId(productoId, productos) {
      return new Promise((resolve, reject) => {
          setTimeout(() => {
              const producto = productos.find(p => p.id === productoId);
              if (producto) {
                  resolve(producto);
              } else {
                  reject(new Error('Producto no encontrado'));
              }
          }, 1000);
      });
  }

  function updateCartDOM(itemsCarritoPisos, itemsCarritoPlasticos, itemsCarritoCloro, totalCarrito) {
      const carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      // Limpiar secciones antes de actualizar
      clearSections();

      let total = 0;

      carrito.forEach(producto => {
          const li = document.createElement('li');
          li.innerHTML = `
              ${producto.nombre} - $${producto.precio.toFixed(2)}
              <button onclick="removeFromCart(${producto.id})">Eliminar</button>`;

          // Agregar el producto a la sección correspondiente
          addToSection(producto, li);

          total += producto.precio;
      });

      totalCarrito.textContent = total.toFixed(2);
  }

  function clearSections() {
      // Limpiar contenido de las secciones
      itemsCarritoPisos.innerHTML = '';
      itemsCarritoPlasticos.innerHTML = '';
      itemsCarritoCloro.innerHTML = '';
      // Agregar más secciones según tus necesidades
      // ...
  }

  function addToSection(producto, li) {
      // Agregar el producto a la sección correspondiente según su categoría
      if (producto.nombre.toLowerCase().includes('pisos')) {
          itemsCarritoPisos.appendChild(li);
      } else if (producto.nombre.toLowerCase().includes('plasticos')) {
          itemsCarritoPlasticos.appendChild(li);
      } else if (producto.nombre.toLowerCase().includes('cloro')) {
          itemsCarritoCloro.appendChild(li);
      }
      // Agregar más casos según tus necesidades
      // ...
  }

  window.removeFromCart = function (productoId) {
      let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
      carrito = carrito.filter(producto => producto && producto.id && producto.id !== productoId);
      localStorage.setItem('carrito', JSON.stringify(carrito));
      updateCartDOM(itemsCarritoPisos, itemsCarritoPlasticos, itemsCarritoCloro, totalCarrito);
  };

  updateCartDOM(itemsCarritoPisos, itemsCarritoPlasticos, itemsCarritoCloro, totalCarrito);

  document.getElementById('mostrarAlerta').addEventListener('click', function () {
      if (localStorage.getItem('carrito') && JSON.parse(localStorage.getItem('carrito')).length > 0) {
          mostrarSweetAlert();
          clearCart();
          updateCartDOM(itemsCarritoPisos, itemsCarritoPlasticos, itemsCarritoCloro, totalCarrito);
      } else {
          mostrarErrorAlert();
      }
  });

  function mostrarSweetAlert() {
      Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'Tu compra se realizó correctamente!',
          showConfirmButton: false,
          timer: 1500
      });
  }

  function mostrarErrorAlert() {
      Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No hay productos en el carrito.',
      });
  }

  function clearCart() {
      localStorage.removeItem('carrito');
  }
});
