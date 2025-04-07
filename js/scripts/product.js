document.addEventListener("DOMContentLoaded", function () {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  const btnAddToCart = document.getElementById("addtocart");
  fetch(`https://fakestoreapi.com/products/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      const productThumbnails = document.querySelector(
        ".product_thumbnail_slides"
      );
      const productCategory = document.querySelector(".product-category");
      const productPrice = document.querySelector(".product-price");
      const productDesc = document.querySelector(".product-desc");
      const productTitle = document.querySelector(".product-title");
      productThumbnails.innerHTML = `<img src="${data.image}" alt="${data.title}" width="50%">`;
      productCategory.textContent = data.category;
      productTitle.textContent = data.title;
      productPrice.innerHTML = `${data.price.toFixed(2)}`;
      productDesc.textContent = data.description;
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
  const quantityInput = document.getElementById("productQuantity");
  const increaseBtn = document.getElementById("increaseBtn");
  const decreaseBtn = document.getElementById("decreaseBtn");
  increaseBtn.addEventListener("click", () => {
    quantityInput.value = parseInt(quantityInput.value) + 1;
  });
  decreaseBtn.addEventListener("click", () => {
    const current = parseInt(quantityInput.value);
    if (current > 1) quantityInput.value = current - 1;
  });
  btnAddToCart.addEventListener("click", () => {
    const message = document.getElementById("messageError");
    const size = document.getElementById("productSize").value;
    const quantity = parseInt(quantityInput.value);
    const color = document.getElementById("productColor").value;
    message.textContent = "";
    if (size === "") {
      message.textContent = "Debes seleccionar una talla";
      return;
    }
    if (color === "") {
      message.textContent = "Debes seleccionar un color";
      return;
    }
    if (quantity < 1 || isNaN(quantity) || quantity > 100) {
      message.textContent = "La cantidad no está disponible";
      return;
    }
    const url = document.querySelector(".product_thumbnail_slides img").src;
    const price = document.querySelector(".product-price").textContent;
    const title = document.querySelector(".product-title").textContent;
    const titleCart = `${title.substring(0, 30)}...`;
    const cartItem = {
      productId: productId,
      title: title,
      titleCart: titleCart,
      quantity: quantity,
      size: size,
      color: color,
      price: parseFloat(price),
      image: url,
    };
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cart.findIndex(
      (item) => item.productId === productId
    );
    if (existingItemIndex !== -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    const cartOverlay = document.querySelector(".cart-bg-overlay");
    const cartWrapper = document.querySelector(".right-side-cart-area");

    const cartOverlayOn = "cart-bg-overlay-on";
    const cartOn = "cart-on";

    cartOverlay.classList.toggle(cartOverlayOn);
    cartWrapper.classList.toggle(cartOn);
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
  });
});
