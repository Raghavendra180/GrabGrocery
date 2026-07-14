document.addEventListener("DOMContentLoaded", function () {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");
  const useLocationBtn = document.getElementById("use-location-btn");
  const locationStatus = document.getElementById("location-status");

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let coords = { lat: null, lng: null };

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
        </tr>`;
      cartTotal.innerText = "0";
      return;
    }

    cart.forEach(function (item, index) {
      const price = parseInt(item.price);
      const itemTotal = price * item.quantity;
      total += itemTotal;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td><img src="${item.image}" width="60"><br>${item.name}</td>
        <td>₹${price}</td>
        <td>
          <button class="minus-btn" data-index="${index}">-</button>
          <span style="margin:0 12px;font-weight:bold;">${item.quantity}</span>
          <button class="plus-btn" data-index="${index}">+</button>
        </td>
        <td>₹${itemTotal}</td>
        <td><button class="delete-btn" data-index="${index}">Delete</button></td>
      `;
      cartItems.appendChild(row);
    });

    cartTotal.innerText = total;

    plusButton();
    minusButton();
    deleteButton();
  }

  function plusButton() {
    document.querySelectorAll(".plus-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = button.dataset.index;
        cart[index].quantity++;
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
      });
    });
  }

  function minusButton() {
    document.querySelectorAll(".minus-btn").forEach(function (button) {
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
    document.querySelectorAll(".delete-btn").forEach(function (button) {
      button.addEventListener("click", function () {
        const index = button.dataset.index;
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
      });
    });
  }

  useLocationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
      locationStatus.innerText =
        "Geolocation is not supported by your browser.";
      return;
    }

    locationStatus.innerText = "Fetching your location...";

    navigator.geolocation.getCurrentPosition(
      function (position) {
        coords.lat = position.coords.latitude;
        coords.lng = position.coords.longitude;
        locationStatus.innerText = `Location captured (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}). Please fill in the address fields too.`;
      },
      function () {
        locationStatus.innerText =
          "Could not fetch location. Please enter address manually.";
      },
    );
  });

  checkoutButton.addEventListener("click", async function () {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      window.location.href = "login.html";
      return;
    }

    const fullName = document.getElementById("address-name").value.trim();
    const phone = document.getElementById("address-phone").value.trim();
    const street = document.getElementById("address-street").value.trim();
    const city = document.getElementById("address-city").value.trim();
    const pincode = document.getElementById("address-pincode").value.trim();

    if (!fullName || !phone || !street || !city || !pincode) {
      alert("Please fill in all delivery address fields.");
      return;
    }

    let total = 0;
    cart.forEach(function (item) {
      total += parseInt(item.price) * item.quantity;
    });

    const cleanItems = cart.map(function (item) {
      return {
        name: item.name,
        image: item.image,
        quantity: item.quantity,
        price: parseInt(item.price),
      };
    });

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cleanItems,
          total: total,
          address: {
            fullName,
            phone,
            street,
            city,
            pincode,
            lat: coords.lat,
            lng: coords.lng,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      localStorage.removeItem("cart");
      cart = [];

      alert("Order placed successfully!");
      window.location.href = "orders.html";
    } catch (error) {
      console.log(error);
      alert("Something went wrong placing your order.");
    }
  });
});
