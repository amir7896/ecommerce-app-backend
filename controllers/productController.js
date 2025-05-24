const Product = require("../models/product");

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({
        success: false,
        message: "Server Error: Unable to fetch products.",
      });
  }
};
