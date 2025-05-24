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
