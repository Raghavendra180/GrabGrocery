require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  { name: "Apple", price: 120, image: "images/apple.jpg", category: "Fruits" },
  { name: "Banana", price: 10, image: "images/banana.jpg", category: "Fruits" },
  { name: "Milk", price: 40, image: "images/milk.jpg", category: "Dairy" },
  { name: "Eggs", price: 80, image: "images/eggs.jpg", category: "Dairy" },
  { name: "Chips", price: 20, image: "images/chips.jpg", category: "Snacks" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("Products seeded successfully");
  process.exit();
}

seed();
