document.addEventListener("DOMContentLoaded", async function () {
  const dynamicContainer = document.getElementById("dynamic-products");
  const searchBox = document.getElementById("search-box");

  if (dynamicContainer) {
    await loadProducts();

    if (searchBox) {
      let debounceTimer;
      searchBox.addEventListener("keyup", function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          loadProducts(searchBox.value);
        }, 300);
      });
    }
  } else {
    setupProductCards();

    if (searchBox) {
      searchBox.addEventListener("keyup", function () {
        const searchValue = searchBox.value.toLowerCase();
        const products = document.querySelectorAll(".product-item");
        products.forEach(function (product) {
          const productName = product
            .querySelector("h3")
            .innerText.toLowerCase();
          product.style.display = productName.includes(searchValue)
            ? "block"
            : "none";
        });
      });
    }
  }

  updateFloatingCart();

  async function loadProducts(search = "") {
    try {
      const response = await fetch(`/api/products?search=${search}`);
      const products = await response.json();

      dynamicContainer.innerHTML = "";

      if (products.length === 0) {
        dynamicContainer.innerHTML = "<p>No products found.</p>";
        return;
      }

      products.forEach((product) => {
        const card = document.createElement("div");
        card.className = "product-item";
        card.innerHTML = `
          <img src="${product.image}" alt="${product.name}" />
          <h3>${product.name}</h3>
          <p>${product.price} each</p>
          <button>Add to Cart</button>
        `;
        dynamicContainer.appendChild(card);
      });

      setupProductCards();
    } catch (error) {
      console.log(error);
      dynamicContainer.innerHTML = "<p>Could not load products.</p>";
    }
  }
});

function setupProductCards() {
  const productCards = document.querySelectorAll(".product-item");

  productCards.forEach(function (card) {
    const button = card.querySelector("button");
    if (!button) return;

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
}

function createQuantityBox(card, quantity) {
  const oldButton = card.querySelector("button");
  if (oldButton) oldButton.remove();

  let quantityBox = card.querySelector(".quantity-box");
  if (quantityBox) quantityBox.remove();

  quantityBox = document.createElement("div");
  quantityBox.className = "quantity-box";
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
      addButton.innerText = "Add to Cart";
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
  cart.forEach((item) => (totalItems += item.quantity));

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
