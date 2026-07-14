const User = require("../models/User");

const sellerMiddleware = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || user.role !== "seller") {
      return res.status(403).json({ message: "Access denied. Sellers only." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = sellerMiddleware;
