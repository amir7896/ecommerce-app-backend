# Sales & Inventory Management API

A robust backend API for managing sales data, inventory tracking, and analytics, designed for e-commerce environments (e.g., Amazon & Walmart).  
Built with **Node.js**, **Express.js**, and **MongoDB**.

---

## Table of Contents

- [Features](#features)
- [Stack & Tools](#stack--tools)
- [Setup Instructions](#setup-instructions)
- [API Endpoints](#api-endpoints)
- [Database Design](#database-design)
- [Indexing & Normalization](#indexing--normalization)

---

## Features

- **Sales Analytics:** Track revenue daily, weekly, monthly, yearly; compare between periods; filter by product or category.
- **Inventory Management:** View current inventory, detect low stock, update stock levels.
- **Product Catalog:** Retrieve products, categories, and related info.
- **Optimized Performance:** Indexes for high query speed and efficient aggregations.

---

## Stack & Tools

- **Programming Language:** JavaScript (Node.js)
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **API Type:** RESTful
- **Demo Data:** Generated with @faker-js/faker

---

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone <REPO_URL>
   cd ecommerce-app-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set environment variables:**

   - Copy `.env.example` to `.env` and set your MongoDB URI and PORT (default for local dev is provided).
   - MONGODB_URI, PORT

4. **Populate demo data:**

   ```bash
   npm run seed
   ```

5. **Start the server:**

   ```bash
   npm start
   ```

   The API will run at `http://localhost:5000` by default.

---

## API Endpoints

### Products

- `GET /api/products`  
  _List all products._

### Inventory

- `GET /api/inventory`  
  _List all inventory items._

- `GET /api/inventory?lowStock=true`  
  _List only low-stock inventory items._

- `PATCH /api/inventory/:id`  
  _Update the stock for an inventory item. Example body:_
  ```json
  { "stock": 25 }
  ```

### List All Sales Records

**GET** `/api/sales`  
Retrieve all sales records.

**Optional filters:**

- **By date range:**
- ` GET /api/sales?start=2024-01-01&end=2024-01-31`
- **By product:**
- `GET /api/sales?product=<PRODUCT_ID>`

- **By category:**
- `GET /api/sales?category=Electronics`

### Analyze Revenue

**GET** `/api/sales/revenue`  
Analyze revenue by period and/or category.

**Query Parameters:**

- `period`: `daily` (default) | `weekly` | `monthly` | `yearly`
- `category`: (optional)

**Examples:**

- `GET /api/sales/revenue?period=daily`
- `GET /api/sales/revenue?period=monthly&category=Books`

### Compare Revenue Between Two Date Ranges

**GET** `/api/sales/compare`  
Compare revenue between two different date ranges.

**Query Parameters:**

- `start1`, `end1`: first period start and end dates (`YYYY-MM-DD`)
- `start2`, `end2`: second period start and end dates (`YYYY-MM-DD`)

**Example:**

- `GET /api/sales/compare?start1=2024-01-01&end1=2024-01-31&start2=2023-01-01&end2=2023-01-31`

## Database Documentation

This project uses **MongoDB** as the primary database. The main collections are `products`, `inventory`, and `sales`.

---

### Collections & Schemas

#### 1. Product (`products`)

| Field       | Type     | Description                                 |
| ----------- | -------- | ------------------------------------------- |
| `_id`       | ObjectId | Unique identifier (MongoDB-generated)       |
| `name`      | String   | Name of the product                         |
| `category`  | String   | Product category (e.g., Electronics, Books) |
| `brand`     | String   | Brand name                                  |
| `sku`       | String   | Stock Keeping Unit (unique code)            |
| `createdAt` | Date     | Timestamp (auto-generated)                  |
| `updatedAt` | Date     | Timestamp (auto-generated)                  |

**Purpose:**  
Stores master data for every product that can be tracked for inventory and sales.

---

#### 2. Inventory (`inventories`)

| Field           | Type     | Description                                |
| --------------- | -------- | ------------------------------------------ |
| `_id`           | ObjectId | Unique identifier (MongoDB-generated)      |
| `product`       | ObjectId | Reference to a Product (`products._id`)    |
| `stock`         | Number   | Current stock level for this product       |
| `lowStockAlert` | Number   | Threshold for low stock alert (default: 5) |
| `createdAt`     | Date     | Timestamp (auto-generated)                 |
| `updatedAt`     | Date     | Timestamp (auto-generated)                 |

**Purpose:**  
Tracks the real-time inventory for each product, including low stock alerts.

**Relationships:**

- `product` is a foreign key referencing `products._id`.

---

#### 3. Sale (`sales`)

| Field      | Type     | Description                                        |
| ---------- | -------- | -------------------------------------------------- |
| `_id`      | ObjectId | Unique identifier (MongoDB-generated)              |
| `product`  | ObjectId | Reference to a Product (`products._id`)            |
| `quantity` | Number   | Number of units sold                               |
| `revenue`  | Number   | Revenue generated from this sale                   |
| `soldAt`   | Date     | Date and time of sale (default: current date/time) |
| `channel`  | String   | Sales channel (`Amazon` or `Walmart`)              |

**Purpose:**  
Records every sale transaction, including product sold, quantity, revenue, date, and sales channel.

**Relationships:**

- `product` is a foreign key referencing `products._id`.

---

### Relationships Overview

- **Product** is the core entity; both **Inventory** and **Sale** reference Product by ObjectId.
- There is **no redundant data**: all product-related details are stored only in the `products` collection.
- This structure is **normalized**: data is consistent and easy to maintain.

[products] ←── [inventories]
↑
└───── [sales]

- **products**: Master data for each item.
- **inventories**: Tracks stock levels for each product.
- **sales**: Records each product sale event.

---

### Indexing

- `products.category`: Indexed for fast filtering.
- `inventory.product`: Indexed for quick product lookups.
- `sales.product`: Indexed for product-based aggregations.
- `sales.soldAt`: Indexed for efficient date range queries.
- `sales`: Compound index on `{ soldAt, product }` for reporting.

---

### Example: Inventory Document

```json
{
  "_id": "664b12232ab3c12c34ab5678",
  "product": "664b121f2ab3c12c34ab5677",
  "stock": 12,
  "lowStockAlert": 5,
  "createdAt": "2024-05-24T08:30:12.135Z",
  "updatedAt": "2024-05-24T08:30:12.135Z"
}
```

- **products**: Master data for each item.
- **inventories**: Tracks stock levels for each product.
- **sales**: Records each product sale event.

---

### Indexing

- `products.category`: Indexed for fast filtering.
- `inventory.product`: Indexed for quick product lookups.
- `sales.product`: Indexed for product-based aggregations.
- `sales.soldAt`: Indexed for efficient date range queries.
- `sales`: Compound index on `{ soldAt, product }` for reporting.

---

### Example: Inventory Document

```json
{
  "_id": "664b12232ab3c12c34ab5678",
  "product": "664b121f2ab3c12c34ab5677",
  "stock": 12,
  "lowStockAlert": 5,
  "createdAt": "2024-05-24T08:30:12.135Z",
  "updatedAt": "2024-05-24T08:30:12.135Z"
}
```

### Example: Sale Document

```json
{
  "_id": "664b123a2ab3c12c34ab5679",
  "product": "664b121f2ab3c12c34ab5677",
  "quantity": 2,
  "revenue": 55.98,
  "soldAt": "2024-05-23T13:10:42.531Z",
  "channel": "Amazon"
}
```
