document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("orders-container");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
  const userOrders = allOrders.filter(
    (order) => order.email === loggedInUser.email,
  );
  if (userOrders.length === 0) {
    container.innerHTML = "<h2> No Orders Yet</h2>";
    return;
  }
  userOrders.reverse();
  userOrders.forEach((order, index) => {
    let products = "";
    order.items.forEach((items) => {
      products += `
            <p>
            ${items.name}
            x
            ${items.quantity}
            </p>
            `;
    });
    container.innerHTML += `
        <div class="order-card">
        <h2>Order #${userOrders.length - index}</h2>
        <p><strong>Date :</strong> ${order.date}</p>
        <hr>
        ${products}
        <hr>
        <h3>Total : ${order.total}</h3>
        </div>`;
  });
});
