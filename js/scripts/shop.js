document.addEventListener("DOMContentLoaded", () => {
  // Evento Select
  $("select#sortByselect").on("change", function () {
    const sortValue = $(this).val();
    chargeProducts(sortValue);
  });

  // Evento: cambio en el rango de precio
  const $sliderTarget = $(".slider-range-price");

  if ($sliderTarget.length > 0) {
    const min = parseInt($sliderTarget.data("min")) || 0;
    const max = parseInt($sliderTarget.data("max")) || 1000;

    $sliderTarget.slider({
      range: true,
      min: min,
      max: max,
      values: [min, max],
      slide: function (event, ui) {
        $(".range-price").text(`Rango: $${ui.values[0]} - $${ui.values[1]}`);
      },
      stop: function (event, ui) {
        localStorage.setItem("minPrice", ui.values[0]);
        localStorage.setItem("maxPrice", ui.values[1]);
        document.getElementById("list_products").innerHTML = "";
        chargeProducts();
      },
    });
  } else {
    console.log("No se encontró .slider-range-price");
  }
});
//Clases
class executeRequest {
  constructor() {
    this.url = "https://fakestoreapi.com/products";
  }
  async get() {
    const response = await fetch(this.url);
    const data = await response.json();
    return data;
  }
}
class Cart {
  constructor() {
    this.cart = JSON.parse(localStorage.getItem("cart")) || [];
  }
  addProduct(product) {
    this.cart.push(product);
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
  getProducts() {
    return this.cart;
  }
  clearCart() {
    this.cart = [];
    localStorage.removeItem("cart");
  }
}
//Declaraciones
const counter_products = document.getElementById("counter_products");
const pagination = document.getElementsByClassName("pagination")[0];
const list_products = document.getElementById("list_products");
let page = localStorage.getItem("page") || 1;
let limit = 9;
let length = 0;
//Eventos
pagination.addEventListener("click", (e) => {
  if (e.target.value) {
    localStorage.setItem("page", e.target.value);
    list_products.innerHTML = "";
    page = localStorage.getItem("page") || 1;
    chargeProducts();
  }
});
// Función principal para cargar, filtrar y mostrar productos
window.chargeProducts = function (sortBy = "default") {
  new executeRequest()
    .get()
    .then((data) => {
      // Obtener filtros desde localStorage
      let minPrice = parseFloat(localStorage.getItem("minPrice")) || 0;
      let maxPrice = parseFloat(localStorage.getItem("maxPrice")) || 10000;

      // Filtrar por precio
      data = data.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );

      // Ordenar productos
      switch (sortBy) {
        case "price-low":
          data.sort((a, b) => a.price - b.price);
          break;
        case "price-high":
          data.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          data.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case "name-desc":
          data.sort((a, b) => b.title.localeCompare(a.title));
          break;
      }

      // Paginación
      const length = data.length;
      counter_products.innerHTML = length;
      const totalPages = Math.ceil(length / limit);
      pagination.innerHTML = "";

      // Crear botones de paginación
      pagination.appendChild(
        createPageButton(`<i class="fa fa-angle-left"></i>`, 1)
      );
      for (let i = 1; i <= totalPages; i++) {
        pagination.appendChild(createPageButton(i, i));
      }
      pagination.appendChild(
        createPageButton(`<i class="fa fa-angle-right"></i>`, totalPages)
      );

      // Limpiar productos anteriores
      document.getElementById("list_products").innerHTML = "";

      // Mostrar productos en la página actual
      data.forEach((product, index) => {
        if (index >= limit * (page - 1) && index < limit * page) {
          initProducts(product);
        }
      });
    })
    .catch((error) => {
      console.error("Error al cargar productos:", error);
    });
};
//Cargado
chargeProducts();
//Funciones
function chargeProducts() {
  new executeRequest()
    .get()
    .then((data) => {
      console.log(data);
      //Pagination
      initPagination(data);
      //Products
      data.forEach((product, index) => {
        if (index >= limit * (page - 1) && index < limit * page) {
          initProducts(product);
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}
function createPageButton(content, value) {
  const li = document.createElement("li");
  li.classList.add("page-item");
  const button = document.createElement("button");
  button.className = "page-link bg-secondary text-white";
  button.style.width = "50px";
  button.value = value;
  button.innerHTML = content;
  li.appendChild(button);
  return li;
}
function initPagination(data) {
  const length = data.length;
  counter_products.innerHTML = length;
  const totalPages = Math.ceil(length / limit);
  pagination.innerHTML = "";
  pagination.appendChild(
    createPageButton(`<i class="fa fa-angle-left"></i>`, 1)
  );
  for (let i = 1; i <= totalPages; i++) {
    pagination.appendChild(createPageButton(i, i));
  }
  pagination.appendChild(
    createPageButton(`<i class="fa fa-angle-right"></i>`, totalPages)
  );
}
function initProducts(product) {
  const div = document.createElement("div");
  div.className = "col-12 col-sm-6 col-lg-4";
  const productWrapper = document.createElement("div");
  productWrapper.className = "single-product-wrapper";
  const productImg = document.createElement("div");
  productImg.className = "product-img";
  const img = document.createElement("img");
  img.src = product.image;
  img.alt = product.title;
  const hoverImg = document.createElement("img");
  hoverImg.className = "hover-img";
  hoverImg.src = product.image;
  hoverImg.alt = product.title;
  const productDescription = document.createElement("div");
  productDescription.className = "product-description";
  const span = document.createElement("span");
  span.innerHTML = product.category;
  const a1 = document.createElement("a");
  a1.href = "product.html?id=" + product.id;
  const h6 = document.createElement("h6");
  h6.innerHTML = product.title;
  const p = document.createElement("p");
  p.className = "product-price";
  p.innerHTML = `$${product.price}`;
  const hoverContent = document.createElement("div");
  hoverContent.className = "hover-content";
  const addToCartBtn = document.createElement("div");
  addToCartBtn.className = "add-to-cart-btn";
  const a2 = document.createElement("a");
  a2.className = "btn essence-btn p-0";
  a2.innerHTML = `Ver producto`;
  a2.href = "product.html?id=" + product.id;
  //Append
  list_products.appendChild(div);
  div.appendChild(productWrapper);
  productWrapper.appendChild(productImg);
  productImg.appendChild(img);
  productImg.appendChild(hoverImg);
  productWrapper.appendChild(productDescription);
  productDescription.appendChild(span);
  productDescription.appendChild(a1);
  a1.appendChild(h6);
  productDescription.appendChild(p);
  productDescription.appendChild(hoverContent);
  hoverContent.appendChild(addToCartBtn);
  addToCartBtn.appendChild(a2);
}
