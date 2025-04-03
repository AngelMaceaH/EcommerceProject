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
//Cargado
chargeProducts();
//Funciones
function chargeProducts() {
  new executeRequest()
    .get()
    .then((data) => {
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
  const a = document.createElement("a");
  a.href = "single-product-details.html";
  const h6 = document.createElement("h6");
  h6.innerHTML = product.title;
  const p = document.createElement("p");
  p.className = "product-price";
  p.innerHTML = `$${product.price}`;
  const hoverContent = document.createElement("div");
  hoverContent.className = "hover-content";
  const addToCartBtn = document.createElement("div");
  addToCartBtn.className = "add-to-cart-btn";
  const button = document.createElement("button");
  button.className = "btn essence-btn p-0";
  button.innerHTML = `<img src="img/core-img/bag.svg" width="25" alt="" /> Agregar al carrito`;
  button.onclick = () => {
    alert("Producto agregado al carrito");
  };
  //Append
  list_products.appendChild(div);
  div.appendChild(productWrapper);
  productWrapper.appendChild(productImg);
  productImg.appendChild(img);
  productImg.appendChild(hoverImg);
  productWrapper.appendChild(productDescription);
  productDescription.appendChild(span);
  productDescription.appendChild(a);
  a.appendChild(h6);
  productDescription.appendChild(p);
  productDescription.appendChild(hoverContent);
  hoverContent.appendChild(addToCartBtn);
  addToCartBtn.appendChild(button);
}