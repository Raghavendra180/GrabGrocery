const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const authMiddleware = require("../middleware/authMiddleware");
const sellerMiddleware = require("../middleware/sellerMiddleware");

// Create order (checkout) — protected, customer
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { items, total, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    if (
      !address ||
      !address.fullName ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.pincode
    ) {
      return res.status(400).json({ message: "Delivery address is required" });
    }

    const newOrder = new Order({
      user: req.user.id,
      items,
      total,
      address,
    });

    await newOrder.save();

    res.status(201).json({
      message: "Order placed successfully",
      order: newOrder,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get logged-in user's own orders — protected, customer
router.get("/my", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ date: -1 });
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ALL orders — seller only
router.get("/all", authMiddleware, sellerMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "username email")
      .sort({ date: -1 });

    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status — seller only
router.patch(
  "/:id/status",
  authMiddleware,
  sellerMiddleware,
  async (req, res) => {
    try {
      const { status } = req.body;
      const validStatuses = [
        "Pending",
        "Confirmed",
        "Out for Delivery",
        "Delivered",
      ];

      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true },
      );

      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({ message: "Status updated", order });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
);

module.exports = router;
