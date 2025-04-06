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
});
const btnOpenCart = document.getElementById("essenceCartBtn");

btnOpenCart.addEventListener("click", function () {
  console.log("Abriendo carrito");
  const storedCart = localStorage.getItem("cart");
  if (storedCart) {
    chargeCart(storedCart);
  }
  const originalSetItem = localStorage.setItem;
  localStorage.setItem = function (key, value) {
    if (key === "cart") {
      chargeCart(value);
    }
    originalSetItem.apply(this, arguments);
  };
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

  items.forEach((element) => {
    createItemCart(element);
  });
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

  const remove = document.createElement("span");
  remove.className = "product-remove";
  remove.innerHTML = `<i class="fa fa-close" aria-hidden="true"></i>`;
  const title = document.createElement("h6");
  title.textContent = element.titleCart || "Producto";

  const row = document.createElement("div");
  row.className = "row";

  row.innerHTML = `
      <div class="col-6">
        <p class="color text-white">Talla: ${element.size}</p>
      </div>
      <div class="col-6">
        <p class="color text-white">Color: ${element.color}</p>
      </div>
      <div class="col-6">
        <p class="color text-white">Cantidad: ${element.quantity}</p>
      </div>
      <div class="col-6 d-flex justify-content-end">
        <p class="color text-white fs-4">$${element.price}</p>
      </div>
    `;

  desc.appendChild(remove);
  desc.appendChild(title);
  desc.appendChild(row);

  link.appendChild(img);
  link.appendChild(desc);

  cartItem.appendChild(link);
  bodyCart.appendChild(cartItem);
}
