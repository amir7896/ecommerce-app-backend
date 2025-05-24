const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch products.",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, category, brand, sku } = req.body;

    if (!name || !category || !brand || !sku) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, category, brand, sku) are required.",
      });
    }

    const existing = await Product.findOne({ sku });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A product with this SKU already exists.",
      });
    }

    const product = await Product.create({ name, category, brand, sku });

    return res.status(201).json({
      success: true,
      message: "Product registered successfully.",
      data: product,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to register product.",
    });
  }
};
