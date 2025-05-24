const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true,
    },
    stock: { type: Number, required: true },
    lowStockAlert: { type: Number, default: 5 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Inventory", inventorySchema);
