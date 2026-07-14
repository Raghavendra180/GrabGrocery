document.addEventListener("DOMContentLoaded", function () {
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  if (!user) {
    window.location.href = "login.html";

    return;
  }

  document.getElementById("profile-name").innerText = user.username;

  document.getElementById("profile-email").innerText = user.email;

  const orders = JSON.parse(localStorage.getItem("orders")) || [];

  const myOrders = orders.filter(function (order) {
    return order.email === user.email;
  });

  document.getElementById("total-orders").innerText = myOrders.length;

  document
    .getElementById("logout-profile")
    .addEventListener("click", function () {
      localStorage.removeItem("loggedInUser");

      alert("Logged Out Successfully");

      window.location.href = "login.html";
    });
});
