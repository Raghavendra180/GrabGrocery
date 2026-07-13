document.addEventListener("DOMContentLoaded", function () {
  const productCards = document.querySelectorAll(".product-item");

  productCards.forEach(function (card) {
    const button = card.querySelector("button");

    const productName = card.querySelector("h3").innerText;
    const productPrice = card.querySelector("p").innerText;
    const productImage = card.querySelector("img").src;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let product = cart.find((item) => item.name === productName);

    if (product) {
      createQuantityBox(card, product.quantity);
    }

    button.addEventListener("click", function () {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];

      let existingProduct = cart.find((item) => item.name === productName);

      if (existingProduct) {
        existingProduct.quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        createQuantityBox(card, existingProduct.quantity);
      } else {
        cart.push({
          name: productName,
          price: productPrice,
          image: productImage,
          quantity: 1,
        });
        localStorage.setItem("cart", JSON.stringify(cart));
        createQuantityBox(card, 1);
      }

      updateFloatingCart();
    });
  });

  updateFloatingCart();
});

function createQuantityBox(card, quantity) {
  const oldButton = card.querySelector("button");
  if (oldButton) {
    oldButton.remove();
  }
  let quantityBox = card.querySelector(".quantity-box");
  if (quantityBox) {
    quantityBox.remove();
  }
  quantityBox = document.createElement("div");
  quantityBox.className = "quanity-box";
  quantityBox.innerHTML = `
  <button class="minus-btn">-</button>
  <span>${quantity}</span>
  <button class="plus-btn">+</button> 
  `;

  card.appendChild(quantityBox);
  const minus = quantityBox.querySelector(".minus-btn");
  const plus = quantityBox.querySelector(".plus-btn");
  const number = quantityBox.querySelector("span");

  plus.addEventListener("click", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find((i) => i.name === card.querySelector("h3").innerText);
    item.quantity++;
    number.innerText = item.quantity;
    localStorage.setItem("cart", JSON.stringify(cart));
    updateFloatingCart();
  });

  minus.addEventListener("click", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let item = cart.find((i) => i.name === card.querySelector("h3").innerText);

    item.quantity--;

    if (item.quantity <= 0) {
      cart = cart.filter((i) => i.name !== item.name);
      localStorage.setItem("cart", JSON.stringify(cart));
      quantityBox.remove();
      const addButton = document.createElement("button");
      addButton.innerText = "Add";
      card.appendChild(addButton);
      location.reload();
    } else {
      number.innerText = item.quantity;
      localStorage.setItem("cart", JSON.stringify(cart));
    }
    updateFloatingCart();
  });
}

function updateFloatingCart() {
  let floating = document.getElementById("floating-cart");

  if (!floating) {
    floating = document.createElement("a");

    floating.id = "floating-cart";

    floating.href = "cart.html";

    document.body.appendChild(floating);
  }

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  let totalItems = 0;

  cart.forEach((item) => {
    totalItems += item.quantity;
  });

  if (totalItems === 0) {
    floating.style.display = "none";
  } else {
    floating.style.display = "flex";

    floating.innerHTML = `
<div class="floating-left">

    <img src="images/shopping-cart.png" class="cart-icon">

    <div class="floating-text">
        <h4>View Cart</h4>
        <p>${totalItems} item${totalItems > 1 ? "s" : ""}</p>
    </div>

</div>

<img src="images/right-arrow.png" class="arrow-icon">
`;
  }
}
