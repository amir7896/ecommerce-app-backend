const Sale = require("../models/sale");
const Product = require("../models/product");
const { dayOfYearToDate } = require("../utils/yearToDate");

exports.getSales = async (req, res) => {
  try {
    const { start, end, product, category } = req.query;
    let filter = {};
    if (start && end) {
      filter.soldAt = { $gte: new Date(start), $lte: new Date(end) };
    }
    if (product) filter.product = product;

    if (category) {
      const products = await Product.find({ category }).select("_id");
      filter.product = { $in: products.map((p) => p._id) };
    }
    const sales = await Sale.find(filter).populate("product");
    return res.status(200).json({ success: true, data: sales });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch sales data.",
      error: err,
    });
  }
};

exports.getRevenue = async (req, res) => {
  try {
    const { period = "daily", category } = req.query;
    let groupFormat = { year: { $year: "$soldAt" } };
    if (period === "daily") groupFormat.day = { $dayOfYear: "$soldAt" };
    if (period === "weekly") groupFormat.week = { $week: "$soldAt" };
    if (period === "monthly") groupFormat.month = { $month: "$soldAt" };

    let match = {};
    if (category) {
      const products = await Product.find({ category }).select("_id");
      match.product = { $in: products.map((p) => p._id) };
    }

    const revenue = await Sale.aggregate([
      { $match: match },
      { $group: { _id: groupFormat, totalRevenue: { $sum: "$revenue" } } },
      {
        $sort: {
          "_id.year": 1,
          ...(period !== "yearly" && { [`_id.${period}`]: 1 }),
        },
      },
    ]);

    const result = revenue.map((entry) => {
      let periodLabel = "";
      let dateString = undefined;

      if (period === "daily") {
        dateString = dayOfYearToDate(entry._id.year, entry._id.day);
        periodLabel = `Date ${dateString}`;
      } else if (period === "weekly") {
        periodLabel = `Year ${entry._id.year} - Week ${entry._id.week}`;
      } else if (period === "monthly") {
        periodLabel = `Year ${entry._id.year} - Month ${entry._id.month}`;
      } else if (period === "yearly") {
        periodLabel = `Year ${entry._id.year}`;
      }
      return {
        period: periodLabel,
        year: entry._id.year,
        ...(entry._id.month && { month: entry._id.month }),
        ...(entry._id.week && { week: entry._id.week }),
        ...(entry._id.day && { day: entry._id.day }),
        ...(dateString && { date: dateString }),
        totalRevenue: entry.totalRevenue,
      };
    });

    return res.status(200).json({ success: true, data: result });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to analyze revenue.",
      error: err,
    });
  }
};

exports.compareRevenue = async (req, res) => {
  try {
    const { start1, end1, start2, end2 } = req.query;
    const periods = [
      { label: "currentPeriod", start: new Date(start1), end: new Date(end1) },
      { label: "previousPeriod", start: new Date(start2), end: new Date(end2) },
    ];
    let result = {};
    for (const { label, start, end } of periods) {
      const total = await Sale.aggregate([
        { $match: { soldAt: { $gte: start, $lte: end } } },
        { $group: { _id: null, totalRevenue: { $sum: "$revenue" } } },
      ]);
      result[label] = {
        start,
        end,
        revenue: total[0]?.totalRevenue || 0,
      };
    }
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to compare revenue.",
      error: err,
    });
  }
};
