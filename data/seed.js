require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const Product = require("../models/product");
const Inventory = require("../models/inventory");
const Sale = require("../models/sale");

mongoose.connect(process.env.MONGODB_URI);

const categories = ["Electronics", "Books", "Clothing", "Home", "Sports"];
const brands = ["Amazon", "Walmart", "Sony", "Nike", "Samsung"];

async function seed() {
  await Product.deleteMany({});
  await Inventory.deleteMany({});
  await Sale.deleteMany({});
  let products = [];
  for (let i = 0; i < 20; i++) {
    let prod = await Product.create({
      name: faker.commerce.productName(),
      category: faker.helpers.arrayElement(categories),
      brand: faker.helpers.arrayElement(brands),
      sku: faker.string.uuid(),
    });
    products.push(prod);
    await Inventory.create({
      product: prod._id,
      stock: faker.number.int({ min: 0, max: 100 }),
      lowStockAlert: faker.number.int({ min: 5, max: 15 }),
    });
  }
  for (let i = 0; i < 200; i++) {
    let prod = faker.helpers.arrayElement(products);
    let qty = faker.number.int({ min: 1, max: 5 });
    let unitPrice = Number(faker.commerce.price({ min: 10, max: 100 }));
    let revenue = qty * unitPrice;
    await Sale.create({
      product: prod._id,
      quantity: qty,
      revenue: revenue,
      soldAt: faker.date.between({ from: "2023-01-01", to: "2024-12-31" }),
      channel: faker.helpers.arrayElement(["Amazon", "Walmart"]),
    });
  }
  console.log("Seeding complete.");
  process.exit();
}

seed();
