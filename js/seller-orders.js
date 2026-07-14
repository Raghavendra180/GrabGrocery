document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("seller-orders-container");
  const token = localStorage.getItem("token");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!token || !loggedInUser || loggedInUser.role !== "seller") {
    alert("Access denied. Sellers only.");
    window.location.href = "login.html";
    return;
  }

  const statuses = ["Pending", "Confirmed", "Out for Delivery", "Delivered"];

  async function loadOrders() {
    try {
      const response = await fetch("/api/orders/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const orders = await response.json();

      if (!response.ok) {
        alert(orders.message);
        return;
      }

      if (orders.length === 0) {
        container.innerHTML = "<h2>No orders yet</h2>";
        return;
      }

      container.innerHTML = "";

      orders.forEach((order) => {
        let products = "";
        order.items.forEach((item) => {
          products += `<p>${item.name} x ${item.quantity}</p>`;
        });

        const dateStr = new Date(order.date).toLocaleString();

        const options = statuses
          .map(
            (s) =>
              `<option value="${s}" ${s === order.status ? "selected" : ""}>${s}</option>`,
          )
          .join("");

        const address = order.address;

        const addressHtml = address
          ? `
            <p><strong>Deliver to:</strong> ${address.fullName}, ${address.street}, ${address.city} - ${address.pincode}</p>
            <p><strong>Phone:</strong> ${address.phone}</p>
            ${
              address.lat && address.lng
                ? `<p><a href="https://www.google.com/maps?q=${address.lat},${address.lng}" target="_blank">View on Map 📍</a></p>`
                : ""
            }
          `
          : `<p><strong>Deliver to:</strong> No address provided (old order)</p>`;

        const customerName = order.user ? order.user.username : "Unknown";
        const customerEmail = order.user ? order.user.email : "N/A";

        const card = document.createElement("div");
        card.className = "order-card";
        card.innerHTML = `
          <h2>Order #${order._id.slice(-6).toUpperCase()}</h2>
          <p><strong>Customer:</strong> ${customerName} (${customerEmail})</p>
          <p><strong>Date:</strong> ${dateStr}</p>
          <hr>
          ${products}
          <hr>
          ${addressHtml}
          <hr>
          <h3>Total: ${order.total}</h3>
          <label><strong>Update Status:</strong></label>
          <select class="status-select" data-id="${order._id}">
            ${options}
          </select>
        `;

        container.appendChild(card);
      });

      document.querySelectorAll(".status-select").forEach((select) => {
        select.addEventListener("change", async function () {
          const orderId = select.dataset.id;
          const newStatus = select.value;

          try {
            const res = await fetch(`/api/orders/${orderId}/status`, {
              method: "PATCH",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ status: newStatus }),
            });

            const data = await res.json();

            if (!res.ok) {
              alert(data.message);
              return;
            }

            alert("Status updated to " + newStatus);
          } catch (error) {
            console.log(error);
            alert("Could not update status");
          }
        });
      });
    } catch (error) {
      console.log(error);
      container.innerHTML = "<h2>Could not load orders</h2>";
    }
  }

  loadOrders();
});
