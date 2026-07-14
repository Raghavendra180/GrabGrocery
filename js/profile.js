document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch("/api/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const user = await response.json();

    if (!response.ok) {
      alert(user.message);
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");
      window.location.href = "login.html";
      return;
    }

    document.getElementById("profile-name").innerText = user.username;
    document.getElementById("profile-email").innerText = user.email;

    const ordersResponse = await fetch("/api/orders/my", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const orders = await ordersResponse.json();

    document.getElementById("total-orders").innerText = Array.isArray(orders)
      ? orders.length
      : 0;
  } catch (error) {
    console.log(error);
  }

  document
    .getElementById("logout-profile")
    .addEventListener("click", function () {
      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");
      alert("Logged Out Successfully");
      window.location.href = "login.html";
    });
});
