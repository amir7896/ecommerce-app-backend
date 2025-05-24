const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    category: { type: String, index: true },
    brand: String,
    sku: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
