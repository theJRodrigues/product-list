(() => {
  fetch("assets/js/data.json")
    .then((response) => response.json())
    .then((products) => {
      createElements(products);
    });
})();

function createElements(products) {
  const products_section = document.querySelector(".box-cards");
  products.map((product) => {
    const div = document.createElement("div");
    const img_card = document.createElement("img");
    const category = document.createElement("h2");
    const name = document.createElement("h1");
    const price = document.createElement("p");
    const button = document.createElement("button");
    const button_img = document.createElement("img");
    const button_span = document.createElement("span");

    div.classList.add("card");
    img_card.classList.add("img-card");
    category.classList.add("category");
    name.classList.add("name");
    price.classList.add("price");
    button.classList.add("button-product");

    button.setAttribute("onclick", "addProductCart(this)");
    button_span.textContent = "Add to cart";
    button_img.src = "assets/images/icon-add-to-cart.svg";
    name.textContent = product.name;
    category.textContent = product.category;
    price.textContent = product.price.toFixed(2);
    img_card.alt = product.name;

    div.appendChild(img_card);
    div.appendChild(button);
    div.appendChild(category);
    div.appendChild(name);
    div.appendChild(price);
    button.appendChild(button_img);
    button.appendChild(button_span);
    products_section.appendChild(div);

    img_card_resize(product, img_card);
  });
  //button_event(products);
}

function img_card_resize(product, img_card) {
  if (window.innerWidth >= 750) {
    img_card.src = product.image.desktop;
    window.addEventListener("resize", () => {
      if (window.innerWidth < 750) {
        img_card.src = product.image.mobile;
      } else {
        img_card.src = product.image.desktop;
      }
    });
  } else {
    img_card.src = product.image.mobile;
    window.addEventListener("resize", () => {
      if (window.innerWidth > 750) {
        img_card.src = product.image.desktop;
      } else {
        img_card.src = product.image.mobile;
      }
    });
  }
}

function addProductCart(button) {
  const elements = button.parentNode;
  const product = {
    name: elements.querySelector(".name").innerHTML,
    price: parseFloat(elements.querySelector(".price").innerHTML),
    count: 1,
  };
  elements.querySelector('.img-card').classList.add('itemSelected')
  replaceButton(elements, button);
  createProductCart(product);
}

var productsCart = [];
function createProductCart(product) {
  //Remove div cart empty
  {
    const cartProducts = document.querySelector(".cart-products");
    const cartEmpty = document.querySelector(".cart-empty");
    cartProducts.style.display = "flex";
    cartEmpty.style.display = "none";
  }

  productsCart.push({
    name: product.name,
    price: product.price,
    totalPriceItem: product.price,
    count: product.count,
  });
  //Create Product in cart
  {
    const cartItem = document.querySelector(".cart-item");
    const item = document.createElement("div");
    const infoItem = document.createElement("div");
    const removeIcon = document.createElement("img");
    const nameItem = document.createElement("h1");
    const quantityItem = document.createElement("span");
    const unityPrice = document.createElement("span");
    const totalPrice = document.createElement("span");

    nameItem.innerHTML = product.name;
    quantityItem.innerHTML = `${product.count}x`;
    unityPrice.innerHTML = `@$${product.price.toFixed(2)}`;
    totalPrice.innerHTML = `$${product.price.toFixed(2)}`;

    removeIcon.src = "assets/images/icon-remove-item.svg";
    removeIcon.alt = "remove icon";

    item.classList.add("itemUnity");
    infoItem.classList.add("infoItem");
    removeIcon.classList.add("removeIcon");
    nameItem.classList.add("nameItem");
    quantityItem.classList.add("quantityItem");
    unityPrice.classList.add("unityPrice");
    totalPrice.classList.add("totalPriceItem");

    cartItem.appendChild(item);
    item.appendChild(infoItem);
    item.appendChild(removeIcon);
    infoItem.appendChild(nameItem);
    infoItem.appendChild(quantityItem);
    infoItem.appendChild(unityPrice);
    infoItem.appendChild(totalPrice);
  }
  totalItensCart();
  totalPriceCart();
}

function replaceButton(elements, button) {
  const buttonIncrement = document.createElement("img");
  const buttonDecrement = document.createElement("img");
  const buttonDiv = document.createElement("div");
  const itemQuantity = document.createElement("span");
  buttonDiv.classList.add("buttonDiv");
  buttonIncrement.classList.add("buttonIncrement");
  buttonDecrement.classList.add("buttonDecrement");

  buttonIncrement.setAttribute("onclick", "incrementItem(this)");
  buttonDecrement.setAttribute("onclick", "decrementItem(this)");
  buttonIncrement.style.cursor = "pointer";
  buttonDecrement.style.cursor = "pointer";

  buttonDiv.appendChild(buttonDecrement);
  buttonDiv.appendChild(itemQuantity);
  buttonDiv.appendChild(buttonIncrement);

  itemQuantity.innerHTML = 1;

  buttonIncrement.src = "assets/images/icon-increment-quantity.svg";
  buttonIncrement.alt = "increment button";
  buttonDecrement.src = "assets/images/icon-decrement-quantity.svg";
  buttonDecrement.alt = "increment button";

  elements.replaceChild(buttonDiv, button);
}

function incrementItem(button) {
  const elements = button.parentNode.parentNode;
  const indexProduct = productsCart.findIndex(
    (e) => e.name === elements.querySelector(".name").innerHTML
  );

  productsCart[indexProduct].count++;
  productsCart[indexProduct].totalPriceItem =
    productsCart[indexProduct].price * productsCart[indexProduct].count;

  const product = document.querySelectorAll(".itemUnity");
  const updatePriceItem =
    product[indexProduct].querySelector(".totalPriceItem");
  const updateItemQuantity =
    product[indexProduct].querySelector(".quantityItem");
  const updateItemCard = elements.querySelector("span");

  updateItemCard.innerHTML = productsCart[indexProduct].count;
  updateItemQuantity.innerHTML = productsCart[indexProduct].count;
  updatePriceItem.innerHTML = `$ ${productsCart[
    indexProduct
  ].totalPriceItem.toFixed(2)}`;

  totalItensCart();
  totalPriceCart();
}

function decrementItem(button) {
  const elements = button.parentNode.parentNode;
  const indexProduct = productsCart.findIndex(
    (e) => e.name === elements.querySelector(".name").innerHTML
  );
  if (productsCart[indexProduct].count < 2) {
    elements.querySelector('.img-card').classList.remove('itemSelected')
    productsCart.splice(indexProduct, 1);
    const product = document.querySelectorAll(".itemUnity");
    const parent = product[indexProduct].parentNode;
    parent.removeChild(product[indexProduct])

    totalItensCart();
    totalPriceCart();
  } else {
    productsCart[indexProduct].count--;
    productsCart[indexProduct].totalPriceItem = productsCart[indexProduct].price * productsCart[indexProduct].count;
    const product = document.querySelectorAll(".itemUnity");
    const updatePriceItem =product[indexProduct].querySelector(".totalPriceItem");
    const updateQuantityItem =product[indexProduct].querySelector(".quantityItem");
    const updateItemCard = elements.querySelector("span");

    updateItemCard.innerHTML = productsCart[indexProduct].count;
    updateQuantityItem.innerHTML = productsCart[indexProduct].count;
    updatePriceItem.innerHTML = `$ ${productsCart[indexProduct].totalPriceItem.toFixed(2)}`;
    totalItensCart();
    totalPriceCart();
    
  }

  if(document.querySelector('.cartTotalItens').innerHTML === '0'){
    const cartProducts = document.querySelector(".cart-products");
    const cartEmpty = document.querySelector(".cart-empty");
    cartProducts.style.display = "none";
    cartEmpty.style.display = "block";
  }
  
}

function totalItensCart() {
  const cartTotalItem = document.querySelector(".cartTotalItens");
  cartTotalItem.innerHTML = productsCart.reduce(
    (total, number) => total + number.count,
    0
  );
}

function totalPriceCart() {
  const totalPriceCart = document.querySelector("#totalPrice");
  totalPriceCart.innerHTML =
    "$" +
    productsCart
      .reduce((total, number) => total + number.totalPriceItem, 0)
      .toFixed(2);
}