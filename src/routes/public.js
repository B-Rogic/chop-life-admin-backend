const express = require("express");
const Product = require("../models/Product");

const router = express.Router();

// GET /api/public/products — public, no auth
router.get("/products", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;