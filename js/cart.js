document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  displayCartItems();

  function displayCartItems() {
    cartItems.innerHTML = "";
    let total = 0;

    cart.forEach(function (item, index) {
      const price = parseInt(item.price);
      const itemTotal = price * item.quantity;
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
            <td><img src="${item.image}" width="50" height="50" alt="${item.name}"></td>
            <td>${price}</td>
            <td>${item.quantity}</td>
            <td>${itemTotal}</td>
            <td><button class="remove-item" data-index="${index}">Remove</button></td>
            `;
      cartItems.appendChild(row);
    });

    cartTotal.innerText = total;

    removeProduct();
  }
  function removeProduct() {
    const removeButtons = document.querySelectorAll(".remove-item");

    removeButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        const index = button.dataset.index;

        if (cart[index].quantity > 1) {
          cart[index].quantity--;
        } else {
          cart.splice(index, 1);
        }

        localStorage.setItem("cart", JSON.stringify(cart));

        displayCartItems();
      });
    });
  }
});
