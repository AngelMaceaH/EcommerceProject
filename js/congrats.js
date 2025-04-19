document.addEventListener("DOMContentLoaded", function () {
  const date = new Date();
  const random = Math.floor(Math.random() * 100000000) + 1;
  const cartOrden = document.getElementById("cart-orden");
  const cartDate = document.getElementById("cart-date");
  cartOrden.innerHTML = `${random}`;
  cartDate.innerHTML = `${date.toLocaleDateString()}`;
  //eliminar carrito
  localStorage.removeItem("cart");
});
