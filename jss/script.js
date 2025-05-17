// Утилиты

function toNum(str) {
  return Number(str.replace(/ /g, "")); // Преобразует строку с пробелами в число
}

function toCurrency(num) {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
  }).format(num); // Форматирует число как валюту
}

// Корзина

const cardAddArr = Array.from(document.querySelectorAll(".card__add")); // Получаем все кнопки добавления товаров
const cartNum = document.querySelector("#cart_num"); // Счётчик товаров в корзине
const cart = document.querySelector("#cart"); // Элемент корзины

class Cart {
  products = []; // Список товаров в корзине

  get count() {
    return this.products.length; // Количество товаров в корзине
  }

  addProduct(product) {
    this.products.push(product); // Добавить товар в корзину
  }

  removeProduct(index) {
    this.products.splice(index, 1); // Удалить товар из корзины по индексу
  }

  get cost() {
    // Суммарная стоимость товаров без скидки
    return this.products.reduce(
      (acc, product) => acc + toNum(product.price),
      0
    );
  }

  get costDiscount() {
    // Суммарная стоимость товаров со скидкой
    return this.products.reduce(
      (acc, product) => acc + toNum(product.priceDiscount),
      0
    );
  }

  get discount() {
    return this.cost - this.costDiscount; // Размер скидки
  }
}

class Product {
  constructor(card) {
    this.imageSrc = card.querySelector(".card__image").children[0].src; // Изображение товара
    this.name = card.querySelector(".card__title").innerText; // Название товара
    this.price = card.querySelector(".card__price--common").innerText; // Обычная цена товара
    this.priceDiscount = card.querySelector(".card__price--discount").innerText; // Цена товара со скидкой
  }
}

const myCart = new Cart();

// Загрузка корзины из localStorage при инициализации
if (!localStorage.getItem("cart")) {
  localStorage.setItem("cart", JSON.stringify(myCart));
}

myCart.products = JSON.parse(localStorage.getItem("cart")).products || [];
cartNum.textContent = myCart.count;

// Обработчик кликов на кнопки добавления товаров в корзину
cardAddArr.forEach((cardAdd) => {
  cardAdd.addEventListener("click", (e) => {
    e.preventDefault();
    const card = e.target.closest(".card");
    const product = new Product(card);
    myCart.addProduct(product);
    localStorage.setItem("cart", JSON.stringify(myCart));
    cartNum.textContent = myCart.count;
  });
});

// Попап корзины

const popup = document.querySelector(".popup");
const popupClose = document.querySelector("#popup_close");
const body = document.body;
const popupContainer = document.querySelector("#popup_container");
const popupProductList = document.querySelector("#popup_product_list");
const popupCost = document.querySelector("#popup_cost");
const popupDiscount = document.querySelector("#popup_discount");
const popupCostDiscount = document.querySelector("#popup_cost_discount");

cart.addEventListener("click", (e) => {
  e.preventDefault();
  myCart.products = JSON.parse(localStorage.getItem("cart")).products || [];

  if (myCart.count > 0) {
    popup.classList.add("popup--open");
    body.classList.add("lock");
    fillPopup();
  }
});

function fillPopup() {
  popupProductList.innerHTML = ""; // Очищаем список товаров в попапе
  const productsHTML = myCart.products.map((product) => {
    const productItem = document.createElement("div");
    productItem.classList.add("popup__product");

    const productWrap1 = document.createElement("div");
    productWrap1.classList.add("popup__product-wrap");

    const productWrap2 = document.createElement("div");
    productWrap2.classList.add("popup__product-wrap");

    const productImage = document.createElement("img");
    productImage.classList.add("popup__product-image");
    productImage.src = product.imageSrc;

    const productTitle = document.createElement("h2");
    productTitle.classList.add("popup__product-title");
    productTitle.textContent = product.name;

    const productPrice = document.createElement("div");
    productPrice.classList.add("popup__product-price");
    productPrice.innerHTML = toCurrency(toNum(product.priceDiscount)); // Цена со скидкой

    const productDelete = document.createElement("button");
    productDelete.classList.add("popup__product-delete");
    productDelete.innerHTML = "&#10006;";

    productDelete.addEventListener("click", () => {
      const index = myCart.products.indexOf(product);
      myCart.removeProduct(index);
      localStorage.setItem("cart", JSON.stringify(myCart));
      fillPopup(); // Перерисовываем попап
      cartNum.textContent = myCart.count; // Обновляем счётчик
    });

    productWrap1.appendChild(productImage);
    productWrap1.appendChild(productTitle);
    productWrap2.appendChild(productPrice);
    productWrap2.appendChild(productDelete);
    productItem.appendChild(productWrap1);
    productItem.appendChild(productWrap2);

    return productItem;
  });

  productsHTML.forEach((productHTML) =>
    popupProductList.appendChild(productHTML)
  );

  // Обновляем информацию о стоимости
  popupCost.innerHTML = toCurrency(myCart.cost);
  popupDiscount.innerHTML = toCurrency(myCart.discount);
  popupCostDiscount.innerHTML = toCurrency(myCart.costDiscount);
}

popupClose.addEventListener("click", (e) => {
  e.preventDefault();
  popup.classList.remove("popup--open");
  body.classList.remove("lock");
});

// Обработчик отправки данных формы корзины

const popupSubmit = document.querySelector("#popup_submit");
const popupInfo = document.querySelector(".popup--info");
const popupInfoMessage = document.querySelector("#popup_info_message");
const popupInfoClose = document.querySelector("#popup_info_close");

const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");

popupSubmit.addEventListener("click", (e) => {
  e.preventDefault();

  const cartData = {
    products: myCart.products.map((product) => ({
      name: product.name,
      price: toNum(product.price),
      priceDiscount: toNum(product.priceDiscount),
    })),
    totalCost: myCart.costDiscount,
    totalCostWithoutDiscount: myCart.cost,
    customerName: nameInput.value,
    customerPhone: phoneInput.value,
  };

  // Отправка данных на сервер
  fetch("send_mail.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cartData),
  })
    .then((response) => response.json())
    .then((data) => {
      const message =
        data.status === "success"
          ? "Данные успешно отправлены!"
          : `Ошибка отправки данных: ${data.message}`;
      showMessage(message, data.status === "success" ? "success" : "error");
    })
    .catch(() => {
      showMessage("Ошибка отправки данных. Попробуйте позже.", "error");
    });
});

popupInfoClose.addEventListener("click", (e) => {
  e.preventDefault();
  popupInfo.classList.remove("popup--open");
  body.classList.remove("lock");
});

// Функция для отображения сообщения

function showMessage(message, type) {
  popup.classList.remove("popup--open");
  body.classList.remove("lock");
  popupInfoMessage.textContent = message;
  popupInfo.classList.add("popup--open");
  body.classList.add("lock");
}
