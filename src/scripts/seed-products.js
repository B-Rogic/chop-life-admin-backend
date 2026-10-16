require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const Product = require("../models/Product");

async function main() {
  const filePath = path.join(__dirname, "products.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  const products = JSON.parse(raw);

  console.log(`Loaded ${products.length} products from JSON`);

  // Normalize: merge description1/description2, drop unused fields
  const normalized = products.map((p) => {
    const {
      id, description1, description2,
      bgColor, textColor, bottom, save, regular,
      chicken, beef, volume,
      ...rest
    } = p;

    const description =
      p.description ||
      [description1, description2].filter(Boolean).join(" — ");

    return { ...rest, description };
  });

  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to MongoDB");

  await Product.deleteMany({});
  console.log("Cleared existing products");

  const inserted = await Product.insertMany(normalized);
  console.log(`✅ Inserted ${inserted.length} products`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});