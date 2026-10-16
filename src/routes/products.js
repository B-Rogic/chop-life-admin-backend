const express = require("express");
const Product = require("../models/Product");
const { requireAuthApi } = require("../middleware/auth");

const router = express.Router();

// All product routes require auth
router.use(requireAuthApi);

// GET /api/products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

// POST /api/products
router.post("/", async (req, res) => {
  try {
    const {
      name, ingredients, alergies,
      nutritionInfo, amount, categories, image, comingSoon,
    } = req.body;

    if (!name || amount === undefined) {
      return res.status(400).json({ error: "Name and amount are required" });
    }

    const product = await Product.create({
      name, ingredients, alergies,
      nutritionInfo, amount, categories, image, comingSoon,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message || "Invalid data" });
  }
});

// PUT /api/products/:id
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message || "Invalid data" });
  }
});

// DELETE /api/products/:id
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: "Not found" });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "Invalid id" });
  }
});

module.exports = router;