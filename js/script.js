document.addEventListener("DOMContentLoaded", function () {
  const addToCartButtons = document.querySelectorAll(".product-item button");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const product = button.parentElement;

      const productName = product.querySelector("h3").innerText;
      const productPrice = product.querySelector("p").innerText;

      const productImage = product.querySelector("img").src;

      const productObject = {
        name: productName,
        price: productPrice,
        image: productImage,
        quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart"));

      if (cart === null) {
        cart = [];
      }

      const existingProduct = cart.find((item) => {
        return item.name === productObject.name;
      });

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.push(productObject);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      alert(`${productName} has been added to the cart.`);
    });
  });
});
