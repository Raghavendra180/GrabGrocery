const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

  items: [
    {
      name: String,
      price: Number,
      image: String,
      quantity: Number,
    },
  ],

  total: { type: Number, required: true },

  address: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    lat: { type: Number },
    lng: { type: Number },
  },

  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Out for Delivery", "Delivered"],
    default: "Pending",
  },

  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
