document.addEventListener("DOMContentLoaded", function () {
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    if (key === "cart") {
      chargeCart(value);
    }
    originalSetItem.apply(this, arguments);
  };
  window.addEventListener("storage", function (e) {
    if (e.key === "cart") {
      chargeCart(e.newValue);
    }
  });
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    chargeCart(storedCart);
  }
});
function chargeCart(data) {
  const bodyCart = document.getElementById("body-cart");
  bodyCart.innerHTML = "";
  let items;
  try {
    items = JSON.parse(data);
  } catch (e) {
    console.error("No se pudo parsear el carrito:", e);
    return;
  }
  let totalProducts = 0;
  let subtotal = 0;
  let discount = 0;
  let grandTotal = 0;
  console.log(items);
  items.forEach((element) => {
    totalProducts += element.quantity;
    subtotal += element.price * element.quantity;
    if (subtotal > 2000) {
      discount = subtotal * 0.1;
    } else if (subtotal > 5000) {
      discount = subtotal * 0.2;
    } else {
      discount = 0;
    }
    createItemCart(element);
  });
  if (totalProducts <= 0) {
    const bodyCart = document.getElementById("body-cart");
    bodyCart.innerHTML = `<p class="text-black py-5 px-2">No hay productos en el carrito</p>`;
  }
  grandTotal = subtotal - discount;
  const subtotalElement = document.getElementById("cart-subtotal");
  const discountElement = document.getElementById("cart-discount");
  const grandTotalElement = document.getElementById("cart-grandtotal");
  subtotalElement.innerHTML = `${subtotal.toFixed(2)}`;
  discountElement.innerHTML = `${discount.toFixed(2)}`;
  grandTotalElement.innerHTML = `${grandTotal.toFixed(2)}`;
}
function createItemCart(element) {
  const bodyCart = document.getElementById("body-cart");

  const cartItem = document.createElement("div");
  cartItem.className = "single-cart-item my-2";

  const row = document.createElement("div");
  row.className = "row w-100 text-black";

  // Columna izquierda
  const colLeft = document.createElement("div");
  colLeft.className = "col-8 d-flex align-items-center";

  const rowInner = document.createElement("div");
  rowInner.className = "row";

  const titleCol = document.createElement("div");
  titleCol.className = "col-12";
  const title = document.createElement("p");
  title.textContent = element.title || "Producto sin nombre";
  titleCol.appendChild(title);

  const detailsCol = document.createElement("div");
  detailsCol.className = "col-12";
  const details = document.createElement("p");
  details.textContent = `Talla: ${element.size}  Color: ${element.color}  Cantidad: ${element.quantity}`;
  detailsCol.appendChild(details);

  rowInner.appendChild(titleCol);
  rowInner.appendChild(detailsCol);
  colLeft.appendChild(rowInner);

  // Columna derecha
  const colRight = document.createElement("div");
  colRight.className = "col-4";

  const img = document.createElement("img");
  img.src = element.image;
  img.alt = element.title || "Producto";
  img.className = "img-fluid";

  const price = document.createElement("p");
  price.className = "py-2 fs text-center";
  price.textContent = `L. ${parseFloat(element.price).toFixed(2)}`;

  colRight.appendChild(img);
  colRight.appendChild(price);

  row.appendChild(colLeft);
  row.appendChild(colRight);
  cartItem.appendChild(row);
  bodyCart.appendChild(cartItem);
}
