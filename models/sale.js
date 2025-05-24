const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
    index: true,
  },
  quantity: Number,
  revenue: Number,
  soldAt: { type: Date, default: Date.now, index: true },
  channel: { type: String, enum: ["Amazon", "Walmart"], required: true },
});

saleSchema.index({ soldAt: 1, product: 1 });

module.exports = mongoose.model("Sale", saleSchema);
