const express = require("express");
const router = express.Router();
const salesController = require("../controllers/salesController");

router.get("/", salesController.getSales);
router.get("/revenue", salesController.getRevenue);
router.get("/compare", salesController.compareRevenue);

module.exports = router;
