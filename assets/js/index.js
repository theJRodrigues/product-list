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
    const priceSpan = document.createElement("span");
    const price = document.createElement("p");
    const button = document.createElement("button");
    const button_img = document.createElement("img");
    const button_span = document.createElement("span");
    const buttonIncrement = document.createElement("img");
    const buttonDecrement = document.createElement("img");
    const buttonDiv = document.createElement("div");
    const itemQuantity = document.createElement("span");

    div.classList.add("card");
    img_card.classList.add("img-card");
    category.classList.add("category");
    name.classList.add("name");
    priceSpan.classList.add("price");
    button.classList.add("button-product");
    buttonDiv.classList.add("buttonDiv");
    buttonIncrement.classList.add("buttonIncrement");
    buttonDecrement.classList.add("buttonDecrement");
    itemQuantity.classList.add('itemQuantityCard');
    buttonIncrement.setAttribute("onclick", "incrementItem(this)");
    buttonDecrement.setAttribute("onclick", "decrementItem(this)");
    buttonIncrement.style.cursor = "pointer";
    buttonDecrement.style.cursor = "pointer";

    button.setAttribute("onclick", "addProductCart(this)");
    button_span.textContent = "Add to cart";
    button_img.src = "assets/images/icon-add-to-cart.svg";
    name.textContent = product.name;
    category.textContent = product.category;
    price.textContent = "$";
    itemQuantity.textContent = 1;
    img_card.alt = product.name;
    priceSpan.textContent = product.price.toFixed(2);
    buttonIncrement.src = "assets/images/icon-increment-quantity.svg";
    buttonIncrement.alt = "increment button";
    buttonDecrement.src = "assets/images/icon-decrement-quantity.svg";
    buttonDecrement.alt = "increment button";

    button.appendChild(button_img);
    button.appendChild(button_span);
    buttonDiv.appendChild(buttonDecrement);
    buttonDiv.appendChild(itemQuantity);
    buttonDiv.appendChild(buttonIncrement);
    price.appendChild(priceSpan);
    div.appendChild(img_card);
    div.appendChild(button);
    div.appendChild(buttonDiv);
    div.appendChild(category);
    div.appendChild(name);
    div.appendChild(price);
   
    products_section.appendChild(div);
    img_card_resize(product, img_card);
    
  });
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
    name: elements.querySelector(".name").textContent,
    price: parseFloat(elements.querySelector(".price").textContent),
    count: 1,
  };
  elements.querySelector(".img-card").classList.add("itenselected");
  replaceButton(elements);
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

    nameItem.textContent = product.name;
    quantityItem.textContent = `${product.count}x`;
    unityPrice.textContent = `@ $${product.price.toFixed(2)}`;
    totalPrice.textContent = `$${product.price.toFixed(2)}`;

    removeIcon.src = "assets/images/icon-remove-item.svg";
    removeIcon.alt = "remove icon";

    item.classList.add("itemUnity");
    infoItem.classList.add("infoItem");
    removeIcon.classList.add("removeIcon");
    removeIcon.setAttribute('onclick', 'removeItem(this.parentNode)')
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
  totalitensCart();
  totalPriceCart();
}

function replaceButton(elements) {
  const buttonAdd = elements.querySelector('.button-product');
  const buttonIncrement = elements.querySelector('.buttonDiv');
  buttonAdd.style.display = 'none';
  buttonIncrement.style.display = 'flex';
}

function incrementItem(button) {
  const elements = button.parentNode.parentNode;
  const indexProduct = productsCart.findIndex(
    (e) => e.name === elements.querySelector(".name").textContent
  );

  productsCart[indexProduct].count++;
  productsCart[indexProduct].totalPriceItem =
  productsCart[indexProduct].price * productsCart[indexProduct].count;

  const product = document.querySelectorAll(".itemUnity");
  const updatePriceItem = product[indexProduct].querySelector(".totalPriceItem");
  const updateItemQuantity = product[indexProduct].querySelector(".quantityItem");
  const updateItemCard = elements.querySelector(".itemQuantityCard");

  updateItemCard.textContent = productsCart[indexProduct].count;
  updateItemQuantity.textContent = `${productsCart[indexProduct].count}x`;
  updatePriceItem.textContent = `$ ${productsCart[indexProduct].totalPriceItem.toFixed(2)}`;

  totalitensCart();
  totalPriceCart();
}

function decrementItem(button) {
  const elements = button.parentNode.parentNode;
  const indexProduct = productsCart.findIndex(
    (e) => e.name === elements.querySelector(".name").textContent
  );
  if (productsCart[indexProduct].count < 2) {
    elements.querySelector(".img-card").classList.remove("itenselected");
    productsCart.splice(indexProduct, 1);
    const product = document.querySelectorAll(".itemUnity");
    const parent = product[indexProduct].parentNode;
    const buttonAdd = elements.querySelector('.button-product');
    const buttonIncrement = elements.querySelector('.buttonDiv');

    buttonAdd.style.display = 'flex';
    buttonIncrement.style.display = 'none';
    parent.removeChild(product[indexProduct]);
    totalitensCart();
    totalPriceCart();
  } else {
    productsCart[indexProduct].count--;
    productsCart[indexProduct].totalPriceItem =
    productsCart[indexProduct].price * productsCart[indexProduct].count;
    const product = document.querySelectorAll(".itemUnity");
    const updatePriceItem =product[indexProduct].querySelector(".totalPriceItem");
    const updateQuantityItem =product[indexProduct].querySelector(".quantityItem");
    const updateItemCard = elements.querySelector(".itemQuantityCard");

    updateItemCard.textContent = productsCart[indexProduct].count;
    updateQuantityItem.textContent = `${productsCart[indexProduct].count}x`;
    updatePriceItem.textContent = `$ ${productsCart[indexProduct].totalPriceItem.toFixed(2)}`;
    totalitensCart();
    totalPriceCart();
  }

  if (document.querySelector(".cartTotalItens").textContent == 0) {
    const cartProducts = document.querySelector(".cart-products");
    const cartEmpty = document.querySelector(".cart-empty");
    cartProducts.style.display = "none";
    cartEmpty.style.display = "block";
  }
}
function removeItem(element){
  const indexProduct = productsCart.findIndex(
    (e) => e.name === element.querySelector(".nameItem").textContent
  );
  const product = document.querySelectorAll(".itemUnity");
  const parent = document.querySelector('.cart-item');
  const nameItem = Array.from(document.querySelectorAll('.name'));
  const indexButton = nameItem.findIndex((e)=> e.textContent === element.querySelector(".nameItem").textContent);
  const buttonAddCard = document.querySelectorAll('.button-product');
  const buttonIncrementCard = document.querySelectorAll('.buttonDiv');
  const imgProductBorder = document.querySelectorAll('.img-card');

  imgProductBorder[indexButton].classList.remove('itenselected');
  buttonAddCard[indexButton].style.display = "flex";
  buttonIncrementCard[indexButton].style.display = 'none';

  parent.removeChild(product[indexProduct]);
  productsCart.splice(indexProduct, 1);

  totalitensCart();
  totalPriceCart();

  if (document.querySelector(".cartTotalItens").textContent == 0) {
    const cartProducts = document.querySelector(".cart-products");
    const cartEmpty = document.querySelector(".cart-empty");
    cartProducts.style.display = "none";
    cartEmpty.style.display = "block";
  }
  
}

function totalitensCart() {
  const cartTotalItem = document.querySelector(".cartTotalItens");
  cartTotalItem.textContent = productsCart.reduce(
    (total, number) => total + number.count,
    0
  );
}

function totalPriceCart() {
  const totalPriceCart = document.querySelector("#totalPrice");
  totalPriceCart.textContent =
    "$" +
    productsCart
      .reduce((total, number) => total + number.totalPriceItem, 0)
      .toFixed(2);
}

function confirmOrder(){
  document.querySelector('.modalOrderConfirmed').style.display = 'flex'
  var imgThumbnail = [];
  fetch("assets/js/data.json")
    .then((response) => response.json())
    .then((products) => {
      products.map((product) => {
       imgThumbnail.push({name: product.name, img: product.image.thumbnail})
      })

      productsCart.map((product) =>{
        const products1 = document.querySelector('.productsConfirmed');
        const productBox = document.createElement('div');
        const img = document.createElement('img');
        const productInfos = document.createElement('div');
        const name = document.createElement('h1');
        const quantity = document.createElement('span');
        const unityPrice = document.createElement('span');
        const totalPrice = document.createElement('h1');

        name.classList.add('nameItemConfirmed')
        quantity.classList.add('quantityItemConfirmed')
        unityPrice.classList.add('unityPriceConfirmed')
        productBox.classList.add('unityItemConfirmed')
        productInfos.classList.add('productInfoConfirmed')
        totalPrice.classList.add('unityTotalPriceConfirmed')
        
        img.src = imgThumbnail[imgThumbnail.findIndex((e) => e.name === product.name)].img;
        name.textContent = product.name;
        quantity.textContent = `${product.count}x`;
        unityPrice.textContent = `@ $${(product.price).toFixed(2)}`;
        totalPrice.textContent = `$${(product.totalPriceItem).toFixed(2)}`;
  
        productInfos.appendChild(name);
        productInfos.appendChild(quantity);
        productInfos.appendChild(unityPrice);
  
        productBox.appendChild(img);
        productBox.appendChild(productInfos);
        productBox.appendChild(totalPrice);
  
        products1.appendChild(productBox);
      })
    });
    const totalPriceitens = document.querySelector('#totalPriceConfirmed')
    productsCart.reduce((total, number) => total + number.totalPriceItem, 0).toFixed(2);
    totalPriceitens.textContent = `$${productsCart.reduce((total, number) => total + number.totalPriceItem, 0).toFixed(2)}`;
}
