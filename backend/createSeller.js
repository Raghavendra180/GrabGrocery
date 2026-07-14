require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function createSeller() {
  await mongoose.connect(process.env.MONGO_URI);

  const email = "seller@grabgrocery.com";
  const existing = await User.findOne({ email });

  if (existing) {
    console.log("Seller already exists");
    process.exit();
  }

  const hashedPassword = await bcrypt.hash("seller123", 10);

  await User.create({
    username: "GrabGrocery Seller",
    email,
    password: hashedPassword,
    role: "seller",
  });

  console.log("Seller created: seller@grabgrocery.com / seller123");
  process.exit();
}

createSeller();
