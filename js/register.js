document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("register-form");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value.trim();

    const email = document.getElementById("email").value.trim().toLowerCase();

    const password = document.getElementById("password").value;

    if (username === "" || email === "" || password === "") {
      alert("Please fill all fields.");

      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const existingUser = users.find(function (user) {
      return user.email === email;
    });

    if (existingUser) {
      alert("Email already registered.");

      return;
    }

    users.push({
      username: username,

      email: email,

      password: password,
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Registration Successful!");

    window.location.href = "login.html";
  });
});
