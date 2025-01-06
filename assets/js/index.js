let catalogItems = [];
const productsCart = [];

(() => {
  fetch("assets/js/data.json")
    .then((response) => response.json())
    .then(response => {
      catalogItems = response;
      return catalogItems;
    })
    .then(createElements);
})();

function createImgCardElement(name, image) {
  const imgCard = document.createElement("img");
  imgCard.classList.add("img-card");
  imgCard.alt = name;

  imgCard.src = window.innerWidth >= 750 ? image.desktop : image.mobile;
  window.addEventListener("resize", () => {
    imgCard.src = window.innerWidth >= 750 ? image.desktop : image.mobile;
  });

  return imgCard;
}

function createAddToCartButton(id) {
  const buttonElement = document.createElement("button");
  buttonElement.classList.add("button-product");
  buttonElement.setAttribute("onclick", `addProductCart("${id}", this)`);

  const imgElement = document.createElement("img");
  imgElement.src = "assets/images/icon-add-to-cart.svg";

  const labelElement = document.createElement("span");
  labelElement.textContent = "Add to cart";

  buttonElement.appendChild(imgElement);
  buttonElement.appendChild(labelElement);

  return buttonElement;
}

function createQuantityControllerButton() {
  const containerElement = document.createElement("div");
  containerElement.classList.add("buttonDiv");

  const buttonIncrement = document.createElement("img");
  buttonIncrement.classList.add("buttonIncrement");
  buttonIncrement.setAttribute("onclick", "incrementItem(this)");
  buttonIncrement.style.cursor = "pointer";
  buttonIncrement.src = "assets/images/icon-increment-quantity.svg";
  buttonIncrement.alt = "increment button";

  const buttonDecrement = document.createElement("img");
  buttonDecrement.classList.add("buttonDecrement");
  buttonDecrement.setAttribute("onclick", "decrementItem(this)");
  buttonDecrement.style.cursor = "pointer";
  buttonDecrement.src = "assets/images/icon-decrement-quantity.svg";
  buttonDecrement.alt = "increment button";

  const itemQuantity = document.createElement("span");
  itemQuantity.classList.add('itemQuantityCard');
  itemQuantity.textContent = 1;

  containerElement.appendChild(buttonDecrement);
  containerElement.appendChild(itemQuantity);
  containerElement.appendChild(buttonIncrement);

  return containerElement;
}

function createCategoryTitle(category) {
  const categoryElement = document.createElement("h2");
  categoryElement.classList.add("category");
  categoryElement.textContent = category;

  return categoryElement;
}

function createNameTitle(name) {
  const nameElement = document.createElement("h1");
  nameElement.classList.add("name");
  nameElement.textContent = name;

  return nameElement;
}

function createPriceText(price) {
  const priceSpan = document.createElement("span");
  priceSpan.classList.add("price");
  priceSpan.textContent = price.toFixed(2);

  const priceElement = document.createElement("p");
  priceElement.textContent = "$";

  priceElement.appendChild(priceSpan);

  return priceElement;
}

function createProductElement(product) {
  const card = document.createElement("div");
  card.classList.add("card");

  card.appendChild(createImgCardElement(product.name, product.image));
  card.appendChild(createAddToCartButton(product.id));
  card.appendChild(createQuantityControllerButton());
  card.appendChild(createCategoryTitle(product.category));
  card.appendChild(createNameTitle(product.name));
  card.appendChild(createPriceText(product.price));

  return card;
}

function createElements(products) {
  const productsSection = document.querySelector(".box-cards");

  products.map((product) => {
    productsSection.appendChild(createProductElement(product));
  });
}

function addProductCart({ id, button }) {
  if (id) {
    const product = catalogItems.find(item => item.id === id);
    createProductCart({ ...product, count: 1 });
  }

  if (button) {
    button.parentNode.querySelector(".img-card").classList.add("itemSelected");
    replaceButton(button.parentNode);
  }
}

function removeEmptyCart() {
  const cartProducts = document.querySelector(".cart-products");
  const cartEmpty = document.querySelector(".cart-empty");
  cartProducts.style.display = "flex";
  cartEmpty.style.display = "none";
}

function createProductCart(product) {
  removeEmptyCart();

  productsCart.push({
    ...product,
    totalPriceItem: product.price,
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
    unityPrice.textContent = `@ $${product.price}`;
    totalPrice.textContent = `$${product.price}`;

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

  updateTotalItensCart();
  updateTotalPriceCart();
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

  const product = productsCart[indexProduct];

  const updatedProduct = {
    ...product,
    count: product.count + 1,
    totalPriceItem: product.price * product.count
  }

  productsCart[indexProduct] = updatedProduct;

  const productElement = document.querySelectorAll(".itemUnity")[indexProduct];

  const updatePriceItem = productElement.querySelector(".totalPriceItem");
  const updateItemQuantity = productElement.querySelector(".quantityItem");
  const updateItemCard = elements.querySelector(".itemQuantityCard");

  updateItemCard.textContent = product.count;
  updateItemQuantity.textContent = `${product.count}x`;
  updatePriceItem.textContent = `$ ${product.totalPriceItem.toFixed(2)}`;

  updateTotalItensCart();
  updateTotalPriceCart();
}

function decrementItem(button) {
  const elements = button.parentNode.parentNode;
  const indexProduct = productsCart.findIndex(
    (e) => e.name === elements.querySelector(".name").textContent
  );
  if (productsCart[indexProduct].count < 2) {
    elements.querySelector(".img-card").classList.remove("itemSelected");
    productsCart.splice(indexProduct, 1);
    const product = document.querySelectorAll(".itemUnity");
    const parent = product[indexProduct].parentNode;
    const buttonAdd = elements.querySelector('.button-product');
    const buttonIncrement = elements.querySelector('.buttonDiv');

    buttonAdd.style.display = 'flex';
    buttonIncrement.style.display = 'none';
    parent.removeChild(product[indexProduct]);
    updateTotalItensCart();
    updateTotalPriceCart();
  } else {
    productsCart[indexProduct].count--;
    productsCart[indexProduct].totalPriceItem =
      productsCart[indexProduct].price * productsCart[indexProduct].count;
    const product = document.querySelectorAll(".itemUnity");
    const updatePriceItem = product[indexProduct].querySelector(".totalPriceItem");
    const updateQuantityItem = product[indexProduct].querySelector(".quantityItem");
    const updateItemCard = elements.querySelector(".itemQuantityCard");

    updateItemCard.textContent = productsCart[indexProduct].count;
    updateQuantityItem.textContent = `${productsCart[indexProduct].count}x`;
    updatePriceItem.textContent = `$ ${productsCart[indexProduct].totalPriceItem.toFixed(2)}`;
    updateTotalItensCart();
    updateTotalPriceCart();
  }

  if (document.querySelector(".cartTotalItens").textContent == 0) {
    const cartProducts = document.querySelector(".cart-products");
    const cartEmpty = document.querySelector(".cart-empty");
    cartProducts.style.display = "none";
    cartEmpty.style.display = "block";
  }
}

function removeItem(element) {
  const indexProduct = productsCart.findIndex(
    (e) => e.name === element.querySelector(".nameItem").textContent
  );
  const product = document.querySelectorAll(".itemUnity");
  const parent = document.querySelector('.cart-item');
  const nameItem = Array.from(document.querySelectorAll('.name'));
  const indexButton = nameItem.findIndex((e) => e.textContent === element.querySelector(".nameItem").textContent);
  const buttonAddCard = document.querySelectorAll('.button-product');
  const buttonIncrementCard = document.querySelectorAll('.buttonDiv');
  const imgProductBorder = document.querySelectorAll('.img-card');

  imgProductBorder[indexButton].classList.remove('itemSelected');
  buttonAddCard[indexButton].style.display = "flex";
  buttonIncrementCard[indexButton].style.display = 'none';

  parent.removeChild(product[indexProduct]);
  productsCart.splice(indexProduct, 1);

  updateTotalItensCart();
  updateTotalPriceCart();

  if (document.querySelector(".cartTotalItens").textContent == 0) {
    const cartProducts = document.querySelector(".cart-products");
    const cartEmpty = document.querySelector(".cart-empty");
    cartProducts.style.display = "none";
    cartEmpty.style.display = "block";
  }
}

function updateTotalItensCart() {
  const cartTotalItem = document.querySelector(".cartTotalItens");
  cartTotalItem.textContent = productsCart.reduce(
    (total, number) => total + number.count,
    0
  );
}

function updateTotalPriceCart() {
  const totalPriceCart = document.querySelector("#totalPrice");
  const totalPriceCartValue = productsCart
    .reduce((total, number) => total + number.totalPriceItem, 0)
    .toFixed(2);

  totalPriceCart.textContent = `$ ${totalPriceCartValue}`;
}

function confirmOrder() {
  document.querySelector('.modalOrderConfirmed').style.display = 'flex'
  var imgThumbnail = [];
  fetch("assets/js/data.json")
    .then((response) => response.json())
    .then((products) => {
      products.map((product) => {
        imgThumbnail.push({ name: product.name, img: product.image.thumbnail })
      })

      productsCart.map((product) => {
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
        quantity.textContent = `${product.count} x`;
        unityPrice.textContent = `@$${(product.price).toFixed(2)} `;
        totalPrice.textContent = `$${(product.totalPriceItem).toFixed(2)} `;

        productInfos.appendChild(name);
        productInfos.appendChild(quantity);
        productInfos.appendChild(unityPrice);

        productBox.appendChild(img);
        productBox.appendChild(productInfos);
        productBox.appendChild(totalPrice);

        products1.appendChild(productBox);
      })
    });
  const totalPriceItens = document.querySelector('#totalPriceConfirmed')
  productsCart.reduce((total, number) => total + number.totalPriceItem, 0).toFixed(2);
  totalPriceItens.textContent = `$${productsCart.reduce((total, number) => total + number.totalPriceItem, 0).toFixed(2)} `;
}
