document.addEventListener("DOMContentLoaded", function () {
  if (!isLocalStorageAvailable()) {
    alert(
      "Tu navegador no permite guardar datos localmente. Activa el almacenamiento local para usar el carrito."
    );
    return;
  }

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
  } else {
    const bodyCart = document.getElementById("body-cart");
    bodyCart.innerHTML = `<p class="text-black py-5 px-2">No hay productos en el carrito</p>`;
  }
});

const btnOpenCart = document.getElementById("essenceCartBtn");
btnOpenCart.addEventListener("click", function () {
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    chargeCart(storedCart);
  }
});

function isLocalStorageAvailable() {
  try {
    const testKey = "__test__";
    localStorage.setItem(testKey, "1");
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
}

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
  const cartCounter1 = document.getElementById("cart-counter-i");
  const cartCounter2 = document.getElementById("cart-counter-ii");
  if (totalProducts != 0) {
    cartCounter1.innerHTML = totalProducts;
    cartCounter2.innerHTML = totalProducts;
  } else {
    const bodyCart = document.getElementById("body-cart");
    bodyCart.innerHTML = `<p class="text-black py-5 px-2">No hay productos en el carrito</p>`;
    cartCounter1.innerHTML = "";
    cartCounter2.innerHTML = "";
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

  const link = document.createElement("a");
  link.href = "#";
  link.className = "product-image";

  const img = document.createElement("img");
  img.src = element.image;
  img.className = "cart-thumb";
  img.alt = "";

  const desc = document.createElement("div");
  desc.className = "cart-item-desc";

  const remove = `<button type="button" onclick="deleteItemCart('${element.productId}')" class="product-remove btn btn-sm border-0" style="background: transparent;"><i class="fa fa-close" aria-hidden="true"></i></button>`;
  const title = document.createElement("h6");
  title.textContent = element.titleCart || "Producto";

  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
      <div class="col-5 py-1">
        <p class="color text-white">Talla: ${element.size}</p>
      </div>
      <div class="col-7 py-1">
        <p class="color text-white">Color: ${element.color}</p>
      </div>
      <div class="col-6 py-1">
        <p class="color text-white">Cantidad: ${element.quantity}</p>
      </div>
      <div class="col-6 py-1">
        <p class="color text-white fs-4">$${element.price}</p>
      </div>
    `;

  desc.insertAdjacentHTML("beforeend", remove);
  desc.appendChild(title);
  desc.appendChild(row);

  link.appendChild(img);
  link.appendChild(desc);

  cartItem.appendChild(link);
  bodyCart.appendChild(cartItem);
}
function deleteItemCart(id) {
  console.log(id);
  const cart = JSON.parse(localStorage.getItem("cart"));
  const updatedCart = cart.filter((item) => item.productId != id);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
  chargeCart(JSON.stringify(updatedCart));
}
