require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const dbCon = require("./config/dbCon");
const cors = require("cors");

const salesRoutes = require("./routes/sales");
const inventoryRoutes = require("./routes/inventory");
const productsRoutes = require("./routes/products");

const app = express();
dbCon();

app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

// Routes
app.use("/api/sales", salesRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/products", productsRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
