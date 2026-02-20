# 🍽️ Chuks Kitchen — Backend API

> A RESTful backend API for a digital food ordering and customer management platform built for **Chuks Kitchen** as part of the **Trueminds Innovations Ltd** Internship Program — Backend Developer Personal Deliverable 1.

---

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [System Architecture](#system-architecture)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [User Endpoints](#user-endpoints)
  - [Food Endpoints](#food-endpoints)
  - [Cart Endpoints](#cart-endpoints)
  - [Order Endpoints](#order-endpoints)
- [Data Models](#data-models)
- [Flow Diagrams](#flow-diagrams)
- [Edge Case Handling](#edge-case-handling)
- [Assumptions](#assumptions)
- [Scalability Considerations](#scalability-considerations)
- [Author](#author)

---

## 📌 Project Overview

**Client:** Mr. Chukwudi Okorie (Mr. Chuks)  
**Business:** Chuks Kitchen  
**Project Type:** Food Ordering & Customer Management System  
**Deliverable Period:** Feb 13th – Feb 27th, 2025

Chuks Kitchen is transitioning from a traditional food business to a fully digital ordering platform. This backend system powers all server-side operations for the platform — from user registration and menu browsing to cart management and order tracking.

The UI/UX design has been completed by the design team. This backend is built to serve the frontend application through a clean, well-structured REST API.

### What the Platform Does

- Allows customers to **register and verify** their accounts via OTP
- Allows customers to **browse** available food items on the menu
- Allows customers to **add items to a cart** and place orders
- Allows customers to **track their order status** in real time
- Allows admins (Chuks Kitchen team) to **manage food items and orders**

---

## 🏗️ System Architecture

The system follows a standard **MVC (Model-View-Controller)** architecture pattern:

```
Client (Frontend / Postman)
        │
        │  HTTP Requests (JSON)
        ▼
┌──────────────────────────────┐
│         Express.js App       │
│  ┌────────────────────────┐  │
│  │        Routes          │  │  ← Receives and directs requests
│  └──────────┬─────────────┘  │
│             │                │
│  ┌──────────▼─────────────┐  │
│  │      Controllers       │  │  ← Handles business logic
│  └──────────┬─────────────┘  │
│             │                │
│  ┌──────────▼─────────────┐  │
│  │        Models          │  │  ← Defines data structure (Mongoose)
│  └──────────┬─────────────┘  │
└─────────────┼────────────────┘
              │
              ▼
       MongoDB Database
```

**Request Lifecycle:**

```
Incoming HTTP Request
        ↓
app.js  →  Middleware (express.json, errorHandler)
        ↓
Route File  →  Matches URL and HTTP method
        ↓
Controller  →  Executes business logic, calls Model
        ↓
Mongoose Model  →  Reads from / writes to MongoDB
        ↓
JSON Response returned to client
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB |
| ODM | Mongoose |
| Environment Config | dotenv |
| Development Tool | Nodemon |
| API Testing | Postman / Thunder Client |

---

## 📁 Folder Structure

```
chuks-kitchen-api/
│
├── config/
│   └── db.js                  # MongoDB connection logic
│
├── controllers/
│   ├── userController.js      # Signup and OTP verification logic
│   ├── foodController.js      # Get and add food items
│   ├── cartController.js      # Add, view, and clear cart
│   └── orderController.js     # Place order and track order status
│
├── models/
│   ├── User.js                # User schema and model
│   ├── Food.js                # Food item schema and model
│   ├── Cart.js                # Cart schema and model
│   ├── Order.js               # Order schema and model
│   └── Rating.js              # Rating schema and model
│
├── routes/
│   ├── userRoutes.js          # POST /signup, POST /verify
│   ├── foodRoutes.js          # GET /foods, POST /foods
│   ├── cartRoutes.js          # POST /cart, GET /cart/:userId, DELETE /cart/:userId
│   └── orderRoutes.js         # POST /orders, GET /orders/:id
│
├── middleware/
│   └── errorHandler.js        # Global error handling middleware
│
├── diagrams/
│   ├── user-registration-flow.png
│   ├── cart-flow.png
│   └── order-flow.png
│
├── .env                       # Environment variables (never commit to Git)
├── .gitignore                 # Excludes node_modules and .env
├── app.js                     # Express app setup and route registration
├── server.js                  # Entry point — connects DB and starts server
├── package.json               # Project metadata and dependencies
└── README.md                  # Project documentation (this file)
```

---

## 🚀 Getting Started

Follow these steps carefully to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) cloud account
- [Postman](https://www.postman.com/) or Thunder Client (VS Code extension) for API testing
- [Git](https://git-scm.com/) for cloning the repository

### Installation Steps

**Step 1 — Clone the repository**

```bash
git clone https://github.com/your-username/chuks-kitchen-api.git
cd chuks-kitchen-api
```

**Step 2 — Install all dependencies**

```bash
npm install
```

**Step 3 — Create your environment file**

```bash
cp .env.example .env
```

Open the `.env` file and fill in your values (see [Environment Variables](#environment-variables) section below).

**Step 4 — Start the development server**

```bash
npm run dev
```

You should see output similar to:

```
[nodemon] starting `node server.js`
Server running on port 5000
MongoDB Connected: localhost
```

**Step 5 — Test that it works**

Open Postman and send the following request:

```
GET http://localhost:5000/api/foods
```

You should receive a JSON response. If you do, your setup is complete and working correctly.

---

## 🔐 Environment Variables

Create a `.env` file in the root of the project with the variables below. Never commit this file to GitHub — it is already listed in `.gitignore`.

```env
# Server
PORT=5000

# MongoDB
MONGO_URI=mongodb://localhost:27017/chukskitchen

# OTP Settings
OTP_EXPIRY_MINUTES=10
```

**If you are using MongoDB Atlas (cloud), your MONGO_URI will look like this:**

```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chukskitchen?retryWrites=true&w=majority
```

Replace `<username>` and `<password>` with your Atlas credentials.

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

All request bodies must use the following header:

```
Content-Type: application/json
```

All responses follow a consistent structure:

```json
{
  "success": true | false,
  "message": "Description of result",
  "data": { }
}
```

---

### 👤 User Endpoints

#### `POST /api/signup`

Registers a new customer account. A 4-digit OTP is generated and sent to the user's email for verification.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "phone": "08012345678",
  "referral_code": "REF123"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Customer's full name |
| email | String | Yes* | Must be unique |
| phone | String | Yes* | Must be unique |
| referral_code | String | No | Optional referral code |

> *At least one of `email` or `phone` is required.

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Account created successfully. OTP sent to your email.",
  "data": {
    "userId": "64abc123def456...",
    "email": "johndoe@gmail.com",
    "is_verified": false
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 400 | "Email already registered" | Duplicate email in database |
| 400 | "Phone number already registered" | Duplicate phone in database |
| 400 | "Name and email or phone are required" | Missing required fields |
| 400 | "Invalid referral code" | Referral code not found in system |

---

#### `POST /api/verify`

Verifies a customer's account using the OTP sent to their email during signup.

**Request Body:**

```json
{
  "email": "johndoe@gmail.com",
  "otp": "4823"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | String | Yes | Email used during signup |
| otp | String | Yes | 4-digit code sent to email |

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Account verified successfully. Welcome to Chuks Kitchen!",
  "data": {
    "userId": "64abc123def456...",
    "is_verified": true
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 404 | "User not found" | Email does not match any record |
| 400 | "Invalid OTP" | OTP does not match stored value |
| 400 | "OTP has expired. Please request a new one." | OTP is older than 10 minutes |
| 400 | "Account is already verified" | User has already completed verification |

---

### 🍛 Food Endpoints

#### `GET /api/foods`

Returns all food items on the menu that are currently marked as available.

**Request Body:** None

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "64abc456...",
      "name": "Jollof Rice",
      "description": "Smoky party jollof rice served with fried chicken",
      "price": 2500,
      "category": "Rice",
      "is_available": true,
      "image_url": "https://example.com/images/jollof.jpg"
    },
    {
      "_id": "64abc789...",
      "name": "Egusi Soup",
      "description": "Rich egusi soup with assorted meat and pounded yam",
      "price": 3000,
      "category": "Soup",
      "is_available": true,
      "image_url": "https://example.com/images/egusi.jpg"
    }
  ]
}
```

---

#### `POST /api/foods`

Adds a new food item to the menu. This simulates an admin action — no role verification is required at this stage.

**Request Body:**

```json
{
  "name": "Fried Rice",
  "description": "Nigerian fried rice with mixed vegetables and grilled chicken",
  "price": 2800,
  "category": "Rice",
  "is_available": true,
  "image_url": "https://example.com/images/friedrice.jpg"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Name of the food item |
| description | String | Yes | Short description |
| price | Number | Yes | Price in Naira (₦) |
| category | String | Yes | e.g. Rice, Soup, Drinks, Snacks |
| is_available | Boolean | No | Defaults to `true` |
| image_url | String | No | URL to food image |

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Food item added successfully.",
  "data": {
    "_id": "64abcnew...",
    "name": "Fried Rice",
    "price": 2800,
    "category": "Rice",
    "is_available": true
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 400 | "Name and price are required" | Missing required fields |
| 409 | "A food item with this name already exists" | Duplicate food name |

---

### 🛒 Cart Endpoints

#### `POST /api/cart`

Adds a food item to the customer's cart. Validates that the item is currently available before adding.

**Request Body:**

```json
{
  "user_id": "64abc123...",
  "food_id": "64abc456...",
  "quantity": 2
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| user_id | String | Yes | The customer's ID |
| food_id | String | Yes | The food item's ID |
| quantity | Number | Yes | Must be at least 1 |

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Item added to cart successfully.",
  "data": {
    "user_id": "64abc123...",
    "items": [
      {
        "food_id": "64abc456...",
        "name": "Jollof Rice",
        "quantity": 2,
        "price": 2500,
        "subtotal": 5000
      }
    ],
    "cart_total": 5000
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 404 | "Food item not found" | Invalid food_id |
| 400 | "This item is currently unavailable" | `is_available` is false |
| 400 | "Quantity must be at least 1" | quantity is 0 or negative |

---

#### `GET /api/cart/:userId`

Retrieves all items in a specific customer's cart, along with the calculated total.

**URL Parameter:** `userId` — the customer's MongoDB ID

**Example Request:**

```
GET http://localhost:5000/api/cart/64abc123...
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "data": {
    "user_id": "64abc123...",
    "items": [
      {
        "food_id": "64abc456...",
        "name": "Jollof Rice",
        "quantity": 2,
        "price": 2500,
        "subtotal": 5000
      },
      {
        "food_id": "64abc789...",
        "name": "Egusi Soup",
        "quantity": 1,
        "price": 3000,
        "subtotal": 3000
      }
    ],
    "cart_total": 8000
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 404 | "No cart found for this user" | userId has no active cart |

---

#### `DELETE /api/cart/:userId`

Clears all items from a customer's cart. This is called automatically after a successful order is placed.

**URL Parameter:** `userId` — the customer's MongoDB ID

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Cart cleared successfully."
}
```

---

### 📦 Order Endpoints

#### `POST /api/orders`

Places a new order from the customer's current cart. The system re-validates all cart items, calculates the total price server-side, creates the order record, and clears the cart on success.

**Request Body:**

```json
{
  "user_id": "64abc123..."
}
```

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Order placed successfully.",
  "data": {
    "_id": "64order001...",
    "user_id": "64abc123...",
    "items": [
      {
        "food_id": "64abc456...",
        "name": "Jollof Rice",
        "quantity": 2,
        "price": 2500,
        "subtotal": 5000
      }
    ],
    "total_price": 5000,
    "status": "Pending",
    "created_at": "2025-02-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 404 | "Cart is empty or not found" | No active cart for this user |
| 400 | "One or more items are no longer available" | Availability re-check failed at order time |

---

#### `GET /api/orders/:id`

Fetches the full details and current status of a specific order.

**URL Parameter:** `id` — the order's MongoDB ID

**Example Request:**

```
GET http://localhost:5000/api/orders/64order001...
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "data": {
    "_id": "64order001...",
    "user_id": "64abc123...",
    "items": [
      {
        "food_id": "64abc456...",
        "name": "Jollof Rice",
        "quantity": 2,
        "price": 2500,
        "subtotal": 5000
      }
    ],
    "total_price": 5000,
    "status": "Preparing",
    "created_at": "2025-02-15T10:30:00.000Z",
    "updated_at": "2025-02-15T10:45:00.000Z"
  }
}
```

**Order Status Lifecycle:**

```
Pending ──► Confirmed ──► Preparing ──► Out for Delivery ──► Completed
   │              │              │                │
   └──────────────┴──────────────┴────────────────┘
                        │
                   Cancelled
         (possible at any stage before Completed)
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 404 | "Order not found" | Invalid or non-existent order ID |

---

## 🗄️ Data Models

### User

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated ID |
| name | String | Yes | Customer full name |
| email | String | Yes* | Must be unique |
| phone | String | Yes* | Must be unique |
| referral_code | String | No | Optional referral code used at signup |
| otp | String | No | Generated 4-digit verification code |
| otp_expires | Date | No | Timestamp for OTP expiry (10 mins) |
| is_verified | Boolean | Yes | Defaults to `false` |
| created_at | Date | Auto | Account creation timestamp |

### Food Item

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated ID |
| name | String | Yes | Food item name — must be unique |
| description | String | Yes | Short description |
| price | Number | Yes | Price in Nigerian Naira (₦) |
| category | String | Yes | e.g. Rice, Soup, Drinks, Snacks |
| is_available | Boolean | Yes | Defaults to `true` |
| image_url | String | No | URL to food image |

### Cart

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated ID |
| user_id | ObjectId | Yes | References → User |
| items | Array | Yes | Array of `{ food_id, name, quantity, price, subtotal }` |
| created_at | Date | Auto | Cart creation timestamp |

### Order

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated ID |
| user_id | ObjectId | Yes | References → User |
| items | Array | Yes | Snapshot of `{ food_id, name, quantity, price, subtotal }` |
| total_price | Number | Yes | Calculated server-side at time of order |
| status | String | Yes | One of: `Pending`, `Confirmed`, `Preparing`, `Out for Delivery`, `Completed`, `Cancelled` |
| created_at | Date | Auto | Order placement timestamp |
| updated_at | Date | Auto | Last status update timestamp |

### Rating

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated ID |
| user_id | ObjectId | Yes | References → User |
| order_id | ObjectId | Yes | References → Order |
| food_id | ObjectId | Yes | References → Food Item |
| score | Number | Yes | Integer between 1 and 5 |
| comment | String | No | Optional review text |
| created_at | Date | Auto | Timestamp |

### Entity Relationship Diagram

```
┌──────────┐     places      ┌──────────┐     contains    ┌───────────┐
│   USER   │ ──────────────► │  ORDER   │ ───────────────► │ FOOD ITEM │
└──────────┘                 └──────────┘                  └───────────┘
     │                            │                              │
     │ has one                    │ rated via                    │
     ▼                            ▼                              │
┌──────────┐               ┌──────────┐                         │
│   CART   │               │  RATING  │ ◄───────────────────────┘
└──────────┘               └──────────┘      references
     │
     │ contains
     ▼
┌───────────┐
│ FOOD ITEM │
└───────────┘
```

---

## 🔀 Flow Diagrams

All diagrams are stored in the `/diagrams` folder of this repository.

### Flow 1 — User Registration & Verification

**File:** `diagrams/user-registration-flow.png`

Step-by-step explanation:

1. User submits name, email (or phone), and an optional referral code to `POST /api/signup`
2. The backend queries the database to check for an existing account with the same email or phone
3. If a duplicate is found, a `400` error is returned with a descriptive message — the user is not created
4. If the referral code is provided, it is validated against existing codes in the database. An invalid code returns a warning but does not block signup
5. The user record is saved to MongoDB with `is_verified: false`
6. A 4-digit OTP is randomly generated and stored alongside an `otp_expires` timestamp (10 minutes from now)
7. The OTP is sent to the user's email (simulated in this version — logged to console)
8. The user submits their OTP to `POST /api/verify`
9. The backend checks: does the OTP match? Has it expired?
10. If valid — `is_verified` is set to `true` and a success response is returned. If invalid or expired — a `400` error is returned

**Key design decision:** OTP validation and expiry are handled entirely server-side. Client-side checks would be bypassable and are not trusted.

---

### Flow 2 — Browse Food & Add to Cart

**File:** `diagrams/cart-flow.png`

Step-by-step explanation:

1. The frontend sends `GET /api/foods` to retrieve the menu
2. The backend queries MongoDB for all food items where `is_available: true`
3. The list is returned to the frontend and displayed to the customer
4. The customer selects a food item and clicks "Add to Cart"
5. The frontend sends `POST /api/cart` with the `user_id`, `food_id`, and `quantity`
6. The backend re-fetches the food item from the database to confirm `is_available` is still `true` — it does NOT trust the frontend's data
7. If the item is unavailable, a `400` error is returned
8. If available, the item is added to the user's cart document in MongoDB, storing a price snapshot at the time of adding
9. The updated cart with totals is returned to the frontend

**Key design decision:** Availability is re-checked server-side at add-to-cart time (not just at display time) because a food item could become unavailable between the menu loading and the customer adding it.

---

### Flow 3 — Place Order

**File:** `diagrams/order-flow.png`

Step-by-step explanation:

1. Customer reviews their cart and clicks "Place Order"
2. The frontend sends `POST /api/orders` with the customer's `user_id`
3. The backend fetches the cart from MongoDB
4. If the cart is empty or not found, a `404` error is returned immediately
5. The backend loops through every cart item and re-validates availability against the database
6. If any item fails the availability check, the entire order is rejected with a `400` error listing which items are unavailable
7. The total price is calculated server-side by multiplying each item's stored price by its quantity and summing up
8. A new Order document is created in MongoDB with status `Pending`
9. The cart is cleared (`DELETE /api/cart/:userId` is called internally)
10. The new order details are returned to the frontend
11. The admin updates the status through its lifecycle: `Confirmed` → `Preparing` → `Out for Delivery` → `Completed`
12. The customer can track the current status at any time via `GET /api/orders/:id`

**Key design decisions:**
- Total price is always calculated server-side so that it cannot be manipulated by the client
- Cart items are re-validated at order placement (second check) to handle the window between adding to cart and placing the order
- The cart is cleared only after the order is successfully created to prevent data loss

---

## ⚠️ Edge Case Handling

| Scenario | Expected Behaviour |
|----------|--------------------|
| User signs up with an already registered email | Returns `400` — "Email already registered". User is not created |
| User signs up with an already registered phone number | Returns `400` — "Phone number already registered". User is not created |
| User provides an invalid referral code | Warning included in response body. Signup proceeds normally |
| User abandons signup midway (no OTP verification) | Record is saved as `is_verified: false`. User can return and complete verification |
| User enters an incorrect OTP | Returns `400` — "Invalid OTP". User may retry |
| OTP has expired (older than 10 minutes) | Returns `400` — "OTP has expired. Please request a new one." |
| Customer tries to add an unavailable food item to cart | Returns `400` — "This item is currently unavailable" |
| Food item becomes unavailable after being added to cart | Caught during order placement re-validation. Returns `400` listing which items are unavailable |
| Customer places an order with an empty cart | Returns `404` — "Cart is empty or not found" |
| Customer cancels an order | Only permitted when status is `Pending` or `Confirmed`. Otherwise rejected |
| Admin cancels an order | Permitted at any stage before `Completed`. Status is updated to `Cancelled` |
| Payment is not completed | Order remains in `Pending` status. Payment integration is out of scope — assumed to time out |
| Cart total is tampered with on the frontend | Ignored entirely. Total is recalculated server-side at the time of order placement |

---

## 📝 Assumptions

The following assumptions were made during the design and development of this system due to missing or unspecified requirements:

1. **OTP Delivery** — OTP is simulated for this deliverable. In production, a real email service (e.g., SendGrid, Nodemailer) or SMS service (e.g., Twilio) would be used. The OTP is currently logged to the console or returned in the response for testing purposes.

2. **OTP Expiry** — An OTP is considered expired if it was generated more than **10 minutes** ago. This duration is configurable via the `OTP_EXPIRY_MINUTES` environment variable.

3. **Authentication** — No JWT or session-based authentication system is implemented, as explicitly stated in the deliverable brief. The `user_id` is passed directly in request bodies to identify the customer.

4. **Admin Access** — Admin actions (e.g., adding food items via `POST /api/foods`, updating order status) are simulated. Any request to these endpoints is treated as a trusted admin action without role or permission verification.

5. **One Cart Per User** — Each customer has a single active cart at any time. Adding new items updates the existing cart document rather than creating a new one.

6. **Payment Processing** — Payment integration is entirely out of scope for this deliverable. Orders proceed to `Pending` status immediately without any payment gateway verification.

7. **Price Integrity** — Food prices stored in the order are taken from the database at the time of order placement. Prices sent from the client are never trusted or used in calculations.

8. **Referral Code Validation** — Referral codes are validated against codes already present in the users collection. An invalid code results in a warning but does not prevent signup.

9. **Single Currency** — All prices are in Nigerian Naira (₦). No multi-currency support is implemented.

10. **No Pagination** — `GET /api/foods` returns all available items in a single response. Pagination is not needed at the current expected scale but should be added when the menu grows significantly.

---

## 📈 Scalability Considerations

The current architecture is designed for simplicity and clarity, appropriate for an early-stage platform. Below is a breakdown of what should change as the user base grows.

### Current Scale (up to ~500 Users)

The current setup handles this comfortably. No immediate changes needed beyond what is already implemented.

### Growing Scale (500 to 5,000 Users)

- Add **MongoDB indexes** on high-frequency query fields: `email`, `phone`, `user_id`, `status`, and `is_available`. This prevents full collection scans and dramatically speeds up reads.
- Add **input validation middleware** using a library like `Joi` or `express-validator` to validate all incoming request bodies before they reach the controller.
- Move from a local MongoDB instance to **MongoDB Atlas** for managed cloud hosting, automatic backups, and built-in monitoring.
- Integrate a real **OTP delivery service** such as SendGrid (email) or Twilio (SMS) to replace the simulated OTP.

### Production Scale (5,000 to 10,000+ Users)

- Implement **JWT-based authentication** (`jsonwebtoken` library) to properly secure all protected routes. Customers and admins should receive signed tokens on login.
- Add **Redis caching** specifically for `GET /api/foods`. The food menu is the most frequently hit endpoint and changes infrequently. Caching it reduces database load significantly.
- Add **rate limiting** using `express-rate-limit` on signup and verify endpoints to prevent brute-force OTP attacks.
- Introduce a **message queue** (e.g., Bull.js with Redis) for handling order notifications asynchronously. Sending notifications inline with the API response slows down response times as volume grows.
- Separate into dedicated **dev, staging, and production environments** with CI/CD pipelines (e.g., GitHub Actions) for safe, automated deployments.
- Consider a **microservices approach** — separating the User Service, Menu Service, Cart Service, and Order Service into independent deployable units as each domain grows in complexity and team size.

---

## 👤 Author

| | |
|---|---|
| **Name** | [Your Full Name] |
| **Role** | Backend Developer Intern |
| **Organization** | Trueminds Innovations Ltd |
| **Deliverable** | Personal Deliverable 1 — Backend Developer |
| **Period** | Feb 13th – Feb 27th, 2025 |
| **Email** | [Your Email Address] |
| **GitHub** | [Your GitHub Profile URL] |

---

> *Built with dedication as part of the Trueminds Innovations Internship Program* 🚀