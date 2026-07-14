document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("orders-container");
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("/api/orders/my", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const orders = await response.json();

    if (!response.ok) {
      alert(orders.message);
      return;
    }

    if (orders.length === 0) {
      container.innerHTML = "<h2>No Orders Yet</h2>";
      return;
    }

    orders.forEach((order, index) => {
      let products = "";
      order.items.forEach((item) => {
        products += `<p>${item.name} x ${item.quantity}</p>`;
      });

      const dateStr = new Date(order.date).toLocaleString();

      const addressHtml = order.address
        ? `
          <p><strong>Delivering to:</strong> ${order.address.fullName}, ${order.address.street}, ${order.address.city} - ${order.address.pincode}</p>
          <p><strong>Phone:</strong> ${order.address.phone}</p>
          `
        : `<p><strong>Delivering to:</strong> No address on file (old order)</p>`;

      container.innerHTML += `
        <div class="order-card">
          <h2>Order #${orders.length - index}</h2>
          <p><strong>Status:</strong> <span class="status-badge">${order.status}</span></p>
          <p><strong>Date:</strong> ${dateStr}</p>
          <hr>
          ${products}
          <hr>
          ${addressHtml}
          <hr>
          <h3>Total: ${order.total}</h3>
        </div>`;
    });
  } catch (error) {
    console.log(error);
    container.innerHTML = "<h2>Could not load orders.</h2>";
  }
});
