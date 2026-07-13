document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  displayCart();

  function displayCart() {
    cartItems.innerHTML = "";

    let total = 0;

    if (cart.length === 0) {
      cartItems.innerHTML = `
            <tr>
                <td colspan="5" style="padding:40px;font-size:20px;">
                    Your cart is empty
                </td>
            </tr>
            `;

      cartTotal.innerText = "0";

      return;
    }

    cart.forEach(function (item, index) {
      const price = parseInt(item.price);

      const itemTotal = price * item.quantity;

      total += itemTotal;

      const row = document.createElement("tr");

      row.innerHTML = `

            <td>

                <img src="${item.image}" width="60">

                <br>

                ${item.name}

            </td>

            <td>₹${price}</td>

            <td>

                <button class="minus-btn" data-index="${index}">-</button>

                <span style="margin:0 12px;font-weight:bold;">

                    ${item.quantity}

                </span>

                <button class="plus-btn" data-index="${index}">+</button>

            </td>

            <td>₹${itemTotal}</td>

            <td>

                <button class="delete-btn" data-index="${index}">

                    Delete

                </button>

            </td>

            `;

      cartItems.appendChild(row);
    });

    cartTotal.innerText = total;

    plusButton();

    minusButton();

    deleteButton();
  }

  function plusButton() {
    const plusButtons = document.querySelectorAll(".plus-btn");

    plusButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = button.dataset.index;

        cart[index].quantity++;

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCart();
      });
    });
  }

  function minusButton() {
    const minusButtons = document.querySelectorAll(".minus-btn");

    minusButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = button.dataset.index;

        cart[index].quantity--;

        if (cart[index].quantity <= 0) {
          cart.splice(index, 1);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCart();
      });
    });
  }

  function deleteButton() {
    const deleteButtons = document.querySelectorAll(".delete-btn");

    deleteButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = button.dataset.index;

        cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCart();
      });
    });
  }

  checkoutButton.addEventListener("click", function () {
    if (cart.length === 0) {
      alert("Your cart is empty.");

      return;
    }

    alert("Order placed successfully!");

    localStorage.removeItem("cart");

    cart = [];

    displayCart();
  });
});
