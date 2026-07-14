document.addEventListener("DOMContentLoaded", () => {
  const protectedPages = [
    "product.html",
    "cart.html",
    "orders.html",
    "profile.html",
  ];
  const currentPage = window.location.pathname.split("/").pop();
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  if (protectedPages.includes(currentPage) && !loggedInUser) {
    alert("Please Login First");
    window.location.href = "login.html";
    return;
  }

  const nav = document.querySelector("nav ul");
  if (!nav) return;
  const oldLogin = document.querySelector('a[href="login.html"]');

  if (loggedInUser) {
    if (oldLogin) {
      oldLogin.parentElement.innerHTML = `
<a href="profile.html">Hi, ${loggedInUser.username}</a>
`;
    }
    const logout = document.createElement("li");

    logout.innerHTML = `
        <a href="#" id="logout-btn">Logout</a>`;

    nav.appendChild(logout);
    document
      .getElementById("logout-btn")
      .addEventListener("click", function (e) {
        e.preventDefault();
        localStorage.removeItem("loggedInUser");
        alert("Logged Out Successfully");
        window.location.href = "login.html";
      });
  }
});
