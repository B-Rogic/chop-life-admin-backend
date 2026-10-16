const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    ingredients: { type: String, default: "" },
    alergies: { type: String, default: "" },       // your spelling
    nutritionInfo: { type: [String], default: [] },

    // number OR array of numbers
    amount: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
      validate: {
        validator(v) {
          if (typeof v === "number") return v >= 0;
          if (Array.isArray(v)) return v.every((n) => typeof n === "number" && n >= 0);
          return false;
        },
        message: "amount must be a number or an array of numbers",
      },
    },

    categories: { type: [String], default: [] },

    image: { type: String, default: "" },
    comingSoon: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);