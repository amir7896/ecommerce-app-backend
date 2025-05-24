const Inventory = require("../models/inventory");
const Product = require("../models/product");

exports.getInventory = async (req, res) => {
  try {
    const { lowStock } = req.query;
    let filter = {};
    if (lowStock === "true") {
      filter.$expr = { $lte: ["$stock", "$lowStockAlert"] };
    }
    const inventory = await Inventory.find(filter).populate("product");
    return res.status(200).json({ success: true, data: inventory });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server Error: Unable to fetch inventory.",
      error: err,
    });
  }
};

exports.updateInventory = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const inv = await Inventory.findByIdAndUpdate(id, { stock }, { new: true });
    if (!inv)
      return res.status(404).json({ message: "Inventory item not found." });
    return res
      .status(200)
      .json({
        success: true,
        message: "Inventory updated successfully",
        data: inv,
      });

    res.json(inv);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server Error: Unable to update inventory.",
      error: err,
    });
  }
};
