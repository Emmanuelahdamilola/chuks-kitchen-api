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
  - [User Endpoints](#-user-endpoints)
  - [Food Endpoints](#-food-endpoints)
  - [Cart Endpoints](#-cart-endpoints)
  - [Order Endpoints](#-order-endpoints)
  - [Rating Endpoints](#-rating-endpoints)
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

Chuks Kitchen is transitioning from a traditional food business to a fully digital ordering platform. This backend system powers all server-side operations for the platform — from user registration and menu browsing to cart management, order tracking, and customer reviews.

The UI/UX design has been completed by the design team. This backend is built to serve the frontend application through a clean, well-structured REST API built with **TypeScript** for type safety and long-term maintainability.

### What the Platform Does

- Allows customers to **register and verify** their accounts via OTP sent to their real email
- Allows customers to **log in securely** with a hashed password
- Allows customers to **browse** available food items with images hosted on Cloudinary
- Allows customers to **manage their cart** — add, update, remove items and clear the cart
- Allows customers to **place orders** and track their status in real time
- Allows customers to **rate and review** food items from completed orders
- Allows admins (Chuks Kitchen team) to **manage food items and orders**

---

## 🏗️ System Architecture

The system follows a standard **MVC (Model-View-Controller)** architecture pattern:

```
Client (Frontend / Postman)
        │
        │  HTTP Requests (JSON / multipart)
        ▼
┌──────────────────────────────────┐
│          Express.js App          │
│  ┌──────────────────────────┐    │
│  │         Routes           │    │  ← Receives and directs requests
│  └────────────┬─────────────┘    │
│               │                  │
│  ┌────────────▼─────────────┐    │
│  │  Middleware (Multer etc) │    │  ← File uploads, error handling
│  └────────────┬─────────────┘    │
│               │                  │
│  ┌────────────▼─────────────┐    │
│  │       Controllers        │    │  ← Business logic
│  └────────────┬─────────────┘    │
│               │                  │
│  ┌────────────▼─────────────┐    │
│  │         Models           │    │  ← Mongoose schemas
│  └────────────┬─────────────┘    │
└───────────────┼──────────────────┘
                │
                ▼
         MongoDB Atlas
                │
                ▼
      Cloudinary (image storage)
      Nodemailer (email delivery)
```

**Request Lifecycle:**

```
Incoming HTTP Request
        ↓
server.ts  →  dotenv.config() loads environment variables
        ↓
app.ts  →  express.json() parses request body
        ↓
Route File  →  Matches URL and HTTP method
        ↓
Middleware  →  Multer handles file uploads (if applicable)
        ↓
Controller  →  Executes business logic, calls models and services
        ↓
Mongoose Model  →  Reads from / writes to MongoDB Atlas
        ↓
External Services  →  Cloudinary (images) / Nodemailer (emails)
        ↓
JSON Response returned to client
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Language | TypeScript | Type safety and better developer experience |
| Runtime | Node.js | JavaScript runtime environment |
| Framework | Express.js | HTTP server and routing |
| Database | MongoDB Atlas | Cloud-hosted NoSQL database |
| ODM | Mongoose | MongoDB object modelling |
| Image Storage | Cloudinary | Cloud-based image hosting and CDN |
| Email Service | Nodemailer + Gmail | OTP email delivery |
| File Uploads | Multer + multer-storage-cloudinary | Handles multipart/form-data |
| Password Hashing | bcrypt | Secure password storage |
| Environment Config | dotenv | Environment variable management |
| Development Tool | Nodemon + ts-node | Auto-restart during development |
| API Testing | Postman | Endpoint testing |

---

## 📁 Folder Structure

```
chuks-kitchen-api/
│
├── src/
│   ├── config/
│   │   ├── db.ts                  # MongoDB Atlas connection
│   │   ├── cloudinary.ts          # Cloudinary SDK configuration
│   │   └── email.ts               # Nodemailer transporter setup
│   │
│   ├── controllers/
│   │   ├── userController.ts      # Signup, verify, resend OTP, login, profile
│   │   ├── foodController.ts      # Get, add, update, delete food items
│   │   ├── cartController.ts      # Add, view, update, remove, clear cart
│   │   ├── orderController.ts     # Place, track, cancel, manage orders
│   │   └── ratingController.ts    # Submit, view, edit, delete reviews
│   │
│   ├── models/
│   │   ├── User.ts                # User schema — name, email, phone, password, OTP
│   │   ├── Food.ts                # Food schema — name, price, category, image_url
│   │   ├── Cart.ts                # Cart schema — user_id, items[], cart_total
│   │   ├── Order.ts               # Order schema — items[], total_price, status
│   │   └── Rating.ts              # Rating schema — score, comment, references
│   │
│   ├── routes/
│   │   ├── userRoutes.ts          # /signup /verify /resend-otp /login /users/:id
│   │   ├── foodRoutes.ts          # /foods (GET, POST, PATCH, DELETE)
│   │   ├── cartRoutes.ts          # /cart (POST, GET, PATCH, DELETE)
│   │   ├── orderRoutes.ts         # /orders (POST, GET, PATCH)
│   │   └── ratingRoutes.ts        # /ratings (POST, GET, PATCH, DELETE)
│   │
│   ├── middleware/
│   │   ├── upload.ts              # Multer + Cloudinary storage config
│   │   └── errorHandler.ts        # Global error handling middleware
│   │
│   ├── utils/
│   │   ├── sendEmail.ts           # Email sending functions
│   │   └── emailTemplates.ts      # HTML email templates (OTP, resend)
│   │
│   ├── app.ts                     # Express setup and route registration
│   └── server.ts                  # Entry point — loads env, connects DB, starts server
│
├── diagrams/
│   ├── user-registration-flow.png
│   ├── cart-flow.png
│   └── order-flow.png
│
├── dist/                          # Compiled JavaScript output (auto-generated)
├── .env                           # Environment variables (never commit to Git)
├── .env.example                   # Example env file for reference
├── .gitignore                     # Excludes node_modules, dist, .env
├── tsconfig.json                  # TypeScript compiler configuration
├── package.json                   # Project metadata and dependencies
└── README.md                      # Project documentation (this file)
```

---

## 🚀 Getting Started

Follow these steps carefully to set up and run the project on your local machine.

### Prerequisites

Make sure you have the following installed before proceeding:

- [Node.js](https://nodejs.org/) v16 or higher
- [Git](https://git-scm.com/) for cloning the repository
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier is fine)
- A [Cloudinary](https://cloudinary.com) account (free tier is fine)
- A Gmail account with an **App Password** generated for Nodemailer
- [Postman](https://www.postman.com/) for API testing

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

Open the `.env` file and fill in all your values (see [Environment Variables](#environment-variables) below).

**Step 4 — Start the development server**

```bash
npm run dev
```

You should see:

```
MongoDB connected: ac-xxxxxxx.mongodb.net
Server is running on http://localhost:5000
Email service is ready to send messages ✅
```

**Step 5 — Verify the setup works**

Open Postman and send:

```
GET http://localhost:5000/api/foods
```

You should receive a JSON response with `"success": true`.

### Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Development | `npm run dev` | Starts server with nodemon + ts-node (auto-restart) |
| Build | `npm run build` | Compiles TypeScript to JavaScript in `/dist` |
| Production | `npm start` | Runs compiled production build |

---

## 🔐 Environment Variables

Create a `.env` file in the root of the project. **Never commit this file to GitHub** — it is already listed in `.gitignore`.

```env
# ── Server ─────────────────────────────────
PORT=5000

# ── MongoDB Atlas ───────────────────────────
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/chukskitchen?retryWrites=true&w=majority

# ── OTP Settings ────────────────────────────
OTP_EXPIRY_MINUTES=10

# ── Cloudinary ──────────────────────────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── Email (Gmail + App Password) ────────────
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_16_character_app_password
EMAIL_FROM=Chuks Kitchen <your_gmail@gmail.com>
```

> ⚠️ **Gmail App Password** — Do not use your regular Gmail password. Generate a dedicated App Password from Google Account → Security → App Passwords. This is a 16-character password that works specifically for third-party apps like Nodemailer.

> ⚠️ **No spaces or quotes** around values in `.env`. `EMAIL_PASS=abcd efgh` is wrong. `EMAIL_PASS=abcdefgh` is correct.

---

## 📡 API Reference

**Base URL:** `http://localhost:5000/api`

All JSON request bodies must include the header:
```
Content-Type: application/json
```

For endpoints that accept file uploads, use `multipart/form-data` (form-data in Postman) instead.

All responses follow this consistent structure:

```json
{
  "success": true,
  "message": "Human-readable result description",
  "data": { }
}
```

---

### 👤 User Endpoints

#### `POST /api/signup`

Registers a new customer account. Hashes the password with bcrypt, generates a 4-digit OTP, and sends a branded HTML email to the user.

**Request Body — `application/json`:**

```json
{
  "name": "John Doe",
  "email": "johndoe@gmail.com",
  "phone": "08012345678",
  "password": "secret123",
  "referral_code": "REF123"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| name | String | Yes | Full name |
| email | String | Yes* | Must be unique |
| phone | String | Yes* | Must be unique |
| password | String | Yes | Minimum 6 characters — stored as bcrypt hash |
| referral_code | String | No | Shows warning if invalid but signup continues |

> *At least one of `email` or `phone` is required.

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Account created successfully. Please check your email for your OTP verification code.",
  "data": {
    "userId": "64abc123...",
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "phone": "08012345678",
    "is_verified": false
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 400 | "Name and at least one of email or phone is required." | Missing required fields |
| 400 | "Password must be at least 6 characters long." | Short password |
| 400 | "An account with this email already exists." | Duplicate email |
| 400 | "An account with this phone number already exists." | Duplicate phone |

---

#### `POST /api/verify`

Verifies a customer's account using the OTP sent to their email. Clears OTP fields after successful verification.

**Request Body:**

```json
{
  "email": "johndoe@gmail.com",
  "otp": "4823"
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Account verified successfully. Welcome to Chuks Kitchen!",
  "data": {
    "userId": "64abc123...",
    "name": "John Doe",
    "is_verified": true
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 404 | "No account found with this email address." | Email not in database |
| 400 | "This account is already verified." | Verification already done |
| 400 | "Invalid OTP. Please check and try again." | Wrong OTP entered |
| 400 | "OTP has expired. Please request a new one." | OTP older than 10 minutes |

---

#### `POST /api/resend-otp`

Generates a fresh OTP and sends a new branded email. Only works for unverified accounts.

**Request Body:**

```json
{
  "email": "johndoe@gmail.com"
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "A new OTP has been sent to your email."
}
```

---

#### `POST /api/login`

Validates credentials and returns user data. Uses bcrypt `comparePassword` to verify the password against the stored hash.

**Request Body:**

```json
{
  "email": "johndoe@gmail.com",
  "password": "secret123"
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Login successful. Welcome back!",
  "data": {
    "userId": "64abc123...",
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "phone": "08012345678",
    "is_verified": true
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 404 | "No account found with this email address." | Email not registered |
| 403 | "Account not verified. Please verify your account before logging in." | Unverified account |
| 401 | "Incorrect password. Please try again." | Wrong password |

---

#### `GET /api/users/:id`

Fetches a customer's profile. Sensitive fields (`password`, `otp`, `otp_expires`) are always excluded from the response.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "data": {
    "_id": "64abc123...",
    "name": "John Doe",
    "email": "johndoe@gmail.com",
    "phone": "08012345678",
    "is_verified": true,
    "createdAt": "2025-02-15T09:00:00.000Z"
  }
}
```

---

### 🍛 Food Endpoints

> **Note:** Food creation and updates use `multipart/form-data` (not JSON) because they accept image file uploads. Use the **form-data** tab in Postman for these requests.

#### `GET /api/foods`

Returns all food items currently marked as available. No body or authentication required.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "64abc456...",
      "name": "Jollof Rice",
      "description": "Smoky party jollof rice with fried chicken",
      "price": 2500,
      "category": "Rice",
      "is_available": true,
      "image_url": "https://res.cloudinary.com/your_cloud/image/upload/v123/chuks-kitchen/food-001.jpg"
    }
  ]
}
```

---

#### `POST /api/foods`

Adds a new food item to the menu with an optional image upload. Image is stored directly on Cloudinary — nothing is saved locally. Simulates an admin action.

**Request Body — `multipart/form-data`:**

| Key | Value | Type |
|-----|-------|------|
| name | Jollof Rice | Text |
| description | Smoky party jollof rice | Text |
| price | 2500 | Text |
| category | Rice | Text |
| is_available | true | Text |
| image | *(select image file)* | **File** |

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Food item added successfully.",
  "data": {
    "_id": "64abc456...",
    "name": "Jollof Rice",
    "price": 2500,
    "category": "Rice",
    "is_available": true,
    "image_url": "https://res.cloudinary.com/your_cloud/image/upload/v123/chuks-kitchen/food-001.jpg"
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 400 | "Name, description, price, and category are required." | Missing fields |
| 409 | "A food item with this name already exists." | Duplicate name |
| 500 | "Only image files are allowed (jpeg, jpg, png, webp)" | Wrong file type uploaded |

---

#### `PATCH /api/foods/:id`

Updates a food item. If a new image is uploaded, the old Cloudinary image is automatically deleted and replaced. Fields not included in the request remain unchanged.

**Request Body — `multipart/form-data`:**

| Key | Value | Type |
|-----|-------|------|
| price | 2700 | Text |
| is_available | false | Text |
| image | *(optional new image)* | File |

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Food item updated successfully.",
  "data": {
    "_id": "64abc456...",
    "name": "Jollof Rice",
    "price": 2700,
    "is_available": false,
    "image_url": "https://res.cloudinary.com/..."
  }
}
```

---

#### `DELETE /api/foods/:id`

Deletes a food item from the database **and** removes its image from Cloudinary to prevent unused file accumulation.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Food item and image deleted successfully."
}
```

---

### 🛒 Cart Endpoints

#### `POST /api/cart`

Adds a food item to the customer's cart. If the item is already in the cart, the quantity is increased rather than creating a duplicate entry. Validates food availability against the database before adding.

**Request Body — `application/json`:**

```json
{
  "user_id": "64abc123...",
  "food_id": "64abc456...",
  "quantity": 2
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Jollof Rice added to cart successfully.",
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
| 400 | "user_id, food_id, and quantity are required." | Missing fields |
| 400 | "Quantity must be at least 1." | Invalid quantity |
| 404 | "Food item not found." | Invalid food_id |
| 400 | "{food name} is currently unavailable." | Food marked unavailable |

---

#### `GET /api/cart/:userId`

Returns the customer's current cart including all items, individual subtotals, and the overall cart total. Uses `.populate()` to return user name and email alongside the cart data.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "data": {
    "user_id": {
      "_id": "64abc123...",
      "name": "John Doe",
      "email": "johndoe@gmail.com"
    },
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

---

#### `PATCH /api/cart/update`

Sets a cart item to an exact new quantity (replaces, does not add). Use this when the customer changes the quantity field directly rather than clicking add again.

**Request Body:**

```json
{
  "user_id": "64abc123...",
  "food_id": "64abc456...",
  "quantity": 5
}
```

---

#### `DELETE /api/cart/item`

Removes a single specific item from the cart. The rest of the cart remains intact.

**Request Body:**

```json
{
  "user_id": "64abc123...",
  "food_id": "64abc456..."
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Jollof Rice removed from cart."
}
```

---

#### `DELETE /api/cart/:userId`

Clears the entire cart. This is also called internally after a successful order is placed.

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

Places a new order from the customer's current cart. The system:
1. Fetches the cart
2. Re-validates every item's availability (second check)
3. Calculates total price server-side
4. Creates the order with status `Pending`
5. Clears the cart automatically

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
  "message": "Order placed successfully! Your food is being processed.",
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
    "createdAt": "2025-02-15T10:30:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 404 | "Your cart is empty. Add items before placing an order." | Empty or missing cart |
| 400 | "The following items are no longer available: Jollof Rice" | Availability re-check failed |

---

#### `GET /api/orders`

Returns all orders in the system. Simulates an admin view. Supports optional status filtering via query parameter.

**Query Parameters:**

| Param | Example | Description |
|-------|---------|-------------|
| status | `?status=Pending` | Filter orders by status |

```
GET http://localhost:5000/api/orders
GET http://localhost:5000/api/orders?status=Pending
GET http://localhost:5000/api/orders?status=Completed
```

---

#### `GET /api/orders/user/:userId`

Returns all orders placed by a specific customer, sorted by newest first.

---

#### `GET /api/orders/:id`

Returns full details and current status of a single order.

**Order Status Lifecycle:**

```
Pending ──► Confirmed ──► Preparing ──► Out for Delivery ──► Completed
   │              │              │                │
   └──────────────┴──────────────┴────────────────┘
                        │
                   Cancelled
         (possible at any stage before Completed)
```

---

#### `PATCH /api/orders/:id/status`

Updates the order status. Simulates an admin action. Cannot update orders that are already `Completed` or `Cancelled`.

**Request Body:**

```json
{
  "status": "Confirmed"
}
```

Valid values: `Pending`, `Confirmed`, `Preparing`, `Out for Delivery`, `Completed`, `Cancelled`

---

#### `PATCH /api/orders/:id/cancel`

Cancels an order with a reason and tracks who cancelled it.

- **Customer** can only cancel when status is `Pending` or `Confirmed`
- **Admin** can cancel at any stage before `Completed`

**Request Body:**

```json
{
  "user_id": "64abc123...",
  "cancelled_by": "Customer",
  "cancellation_reason": "I changed my mind"
}
```

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "message": "Order cancelled successfully.",
  "data": {
    "_id": "64order001...",
    "status": "Cancelled",
    "cancelled_by": "Customer",
    "cancellation_reason": "I changed my mind"
  }
}
```

---

### ⭐ Rating Endpoints

> Customers can only rate food items from **Completed** orders. Each food item from a specific order can only be rated once per customer.

#### `POST /api/ratings`

Submits a review for a food item from a completed order. Validates that the order is completed, the food item was in that order, and the user hasn't already reviewed it.

**Request Body:**

```json
{
  "user_id": "64abc123...",
  "order_id": "64order001...",
  "food_id": "64abc456...",
  "score": 5,
  "comment": "The jollof rice was absolutely amazing!"
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| user_id | String | Yes | Must match order owner |
| order_id | String | Yes | Must be a Completed order |
| food_id | String | Yes | Must be an item in that order |
| score | Number | Yes | Integer between 1 and 5 |
| comment | String | No | Max 500 characters |

**Success Response — `201 Created`:**

```json
{
  "success": true,
  "message": "Review submitted successfully. Thank you!",
  "data": {
    "_id": "64rating001...",
    "user_id": "64abc123...",
    "food_id": "64abc456...",
    "score": 5,
    "comment": "The jollof rice was absolutely amazing!",
    "createdAt": "2025-02-15T12:00:00.000Z"
  }
}
```

**Error Responses:**

| HTTP Status | Message | Cause |
|-------------|---------|-------|
| 400 | "Score must be between 1 and 5." | Invalid score |
| 404 | "Order not found or does not belong to this user." | Wrong order/user |
| 400 | "You can only review items from a completed order." | Order not completed |
| 400 | "This food item was not part of the specified order." | Food not in order |
| 409 | "You have already reviewed this item from this order." | Duplicate review |

---

#### `GET /api/ratings/food/:foodId`

Returns all reviews for a specific food item. Uses `.populate()` to show reviewer names. Calculates and returns the average score.

**Success Response — `200 OK`:**

```json
{
  "success": true,
  "food_item": "Jollof Rice",
  "total_reviews": 4,
  "average_score": 4.5,
  "data": [
    {
      "_id": "64rating001...",
      "user_id": { "_id": "64abc123...", "name": "John Doe" },
      "score": 5,
      "comment": "Best jollof rice in Lagos!",
      "createdAt": "2025-02-15T12:00:00.000Z"
    }
  ]
}
```

---

#### `GET /api/ratings/user/:userId`

Returns all reviews submitted by a specific customer. Uses `.populate()` to include food name, price, and order details.

---

#### `PATCH /api/ratings/:id`

Edits an existing review. Validates that the review belongs to the requesting user before allowing changes.

**Request Body:**

```json
{
  "user_id": "64abc123...",
  "score": 4,
  "comment": "Great food but delivery was slightly slow."
}
```

---

#### `DELETE /api/ratings/:id`

Deletes a review. Validates ownership before deletion.

**Request Body:**

```json
{
  "user_id": "64abc123..."
}
```

---

## 🗄️ Data Models

### User

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated |
| name | String | Yes | Full name |
| email | String | Yes* | Unique, lowercase |
| phone | String | Yes* | Unique |
| password | String | Yes | bcrypt hashed — never returned in responses |
| referral_code | String | No | Code used at signup |
| otp | String | No | 4-digit code — cleared after verification |
| otp_expires | Date | No | 10 minutes from generation — cleared after verification |
| is_verified | Boolean | Yes | Defaults to `false` |
| createdAt | Date | Auto | Mongoose timestamps |
| updatedAt | Date | Auto | Mongoose timestamps |

### Food Item

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated |
| name | String | Yes | Unique |
| description | String | Yes | Short description |
| price | Number | Yes | In Nigerian Naira (₦) |
| category | String | Yes | e.g. Rice, Soup, Drinks, Snacks |
| is_available | Boolean | Yes | Defaults to `true` |
| image_url | String | No | Cloudinary permanent URL |
| createdAt | Date | Auto | Mongoose timestamps |

### Cart

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated |
| user_id | ObjectId | Yes | References User — unique (one cart per user) |
| items | Array | Yes | Embedded `[{ food_id, name, quantity, price, subtotal }]` |
| cart_total | Number | Auto | Recalculated by pre-save hook on every save |
| createdAt | Date | Auto | Mongoose timestamps |

### Order

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated |
| user_id | ObjectId | Yes | References User |
| items | Array | Yes | Snapshot of `[{ food_id, name, quantity, price, subtotal }]` |
| total_price | Number | Yes | Calculated server-side at placement — never from client |
| status | String | Yes | `Pending` \| `Confirmed` \| `Preparing` \| `Out for Delivery` \| `Completed` \| `Cancelled` |
| cancellation_reason | String | No | Recorded when order is cancelled |
| cancelled_by | String | No | `Customer` or `Admin` |
| createdAt | Date | Auto | Mongoose timestamps |
| updatedAt | Date | Auto | Mongoose timestamps |

### Rating

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| _id | ObjectId | Auto | MongoDB auto-generated |
| user_id | ObjectId | Yes | References User |
| order_id | ObjectId | Yes | References Order — must be Completed |
| food_id | ObjectId | Yes | References Food |
| score | Number | Yes | Integer 1–5 |
| comment | String | No | Max 500 characters |
| createdAt | Date | Auto | Mongoose timestamps |

> Compound unique index on `{ user_id, order_id, food_id }` prevents duplicate reviews.

### Entity Relationship Diagram

```
┌──────────┐  places many  ┌──────────┐  contains  ┌───────────┐
│   USER   │ ─────────────►│  ORDER   │───────────►│ FOOD ITEM │
└──────────┘               └──────────┘            └───────────┘
     │                          │                        │
     │ has one                  │ rated via              │
     ▼                          ▼                        │
┌──────────┐             ┌──────────┐                    │
│   CART   │             │  RATING  │◄───────────────────┘
└──────────┘             └──────────┘     references
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

1. User submits name, email/phone, password, and optional referral code to `POST /api/signup`
2. Backend checks for duplicate email and phone simultaneously
3. If duplicate found — `400` returned, user not created
4. Referral code validated if provided — warning returned if invalid, signup continues
5. Password is hashed automatically by bcrypt pre-save hook before storing
6. User saved with `is_verified: false`
7. 4-digit OTP generated with 10-minute expiry timestamp
8. Branded HTML email sent via Nodemailer to user's real email address
9. User submits OTP to `POST /api/verify`
10. Backend validates OTP match and checks expiry timestamp
11. On success — `is_verified: true`, OTP fields cleared from document

**Key design decisions:** Password hashed in model pre-save hook so controllers never handle plaintext. OTP expiry checked server-side — client-side checks are bypassable.

---

### Flow 2 — Browse Food & Add to Cart

**File:** `diagrams/cart-flow.png`

1. Frontend calls `GET /api/foods` — backend returns all items where `is_available: true`
2. Customer selects item and clicks "Add to Cart"
3. Frontend sends `POST /api/cart` with `user_id`, `food_id`, `quantity`
4. Backend re-fetches food from DB to confirm current availability — never trusts frontend data
5. If unavailable — `400` returned
6. Backend checks: does this user already have a cart?
   - No → new Cart document created in memory
   - Yes → existing cart fetched
7. Backend checks: is this food already in the cart?
   - Yes → quantity increased, subtotal recalculated
   - No → new item pushed into items array
8. `cart.save()` called — pre-save hook auto-recalculates `cart_total`
9. Updated cart returned to frontend

---

### Flow 3 — Place Order

**File:** `diagrams/order-flow.png`

1. Customer clicks "Place Order" → `POST /api/orders` with `user_id`
2. Backend fetches cart — if empty, `404` returned immediately
3. Every cart item re-validated for availability (second check)
4. If any item fails — entire order rejected with list of unavailable items
5. Total price calculated server-side from stored item prices
6. Order document created with status `Pending`
7. Cart cleared automatically after successful order creation
8. Admin progresses status: `Confirmed` → `Preparing` → `Out for Delivery` → `Completed`
9. Customer tracks status via `GET /api/orders/:id`

**Key design decisions:** Price always calculated server-side. Cart cleared only after order creation succeeds — never before — to prevent data loss.

---

## ⚠️ Edge Case Handling

| Scenario | How the System Handles It |
|----------|--------------------------|
| Duplicate email at signup | Queries DB before saving — returns `400` |
| Duplicate phone at signup | Same check — returns `400` |
| Invalid referral code | Warning in response, signup continues normally |
| User abandons signup (no OTP) | Saved as `is_verified: false` — can resume later |
| Wrong OTP entered | Returns `400 — "Invalid OTP"` |
| OTP expired | Checked against `otp_expires` timestamp — returns `400` |
| Login before verifying | Returns `403 — "Account not verified"` |
| Wrong password at login | bcrypt comparison returns false — returns `401` |
| Food item unavailable when adding to cart | Availability checked server-side — returns `400` |
| Food becomes unavailable after adding to cart | Re-validated at order placement — order rejected |
| Duplicate cart item | Quantity increased on existing item — no duplicate row |
| Cart total manipulation from frontend | Ignored — total recalculated server-side at order time |
| Empty cart when placing order | Returns `404 — "Your cart is empty"` |
| Customer cancels Preparing/Delivering order | Returns `400` — only Pending/Confirmed allowed for customer |
| Admin cancels completed order | Returns `400` — cannot cancel completed orders |
| Update completed or cancelled order status | Returns `400` — terminal statuses are final |
| Rating a non-completed order | Returns `400 — "You can only review completed orders"` |
| Rating food not in that order | Returns `400 — "This food item was not part of the order"` |
| Duplicate review submission | Compound unique index + check returns `409` |
| Wrong user edits/deletes another's review | Ownership verified — returns `404` |
| Wrong file type uploaded for food image | Multer fileFilter rejects — returns `500` |
| Food item deleted after being ordered | Order history unaffected — items snapshot stored in order document |

---

## 📝 Assumptions

1. **OTP Delivery** — Real OTP emails are sent via Nodemailer and Gmail using an App Password. The OTP is no longer logged to console or returned in the response body.

2. **OTP Expiry** — Expires 10 minutes after generation. Configurable via `OTP_EXPIRY_MINUTES` in `.env`.

3. **Authentication** — No JWT implemented as specified in the deliverable brief. `user_id` is passed in request bodies to identify customers.

4. **Admin Access** — Admin actions (food management, order status updates) are simulated. All requests to these endpoints are treated as trusted admin actions without role verification.

5. **Password Security** — Passwords are hashed using bcrypt with a salt round of 10. Plain-text passwords are never stored or returned in any response.

6. **Image Storage** — All food images are stored on Cloudinary. Nothing is stored locally. Images are automatically deleted from Cloudinary when a food item is updated or deleted.

7. **One Cart Per User** — Each customer has one active cart at a time. `unique: true` on `user_id` enforces this at the database level.

8. **Price Integrity** — Order total is always calculated from the database price at the time of order placement. Prices sent from the client are never used.

9. **Payment Processing** — Out of scope. Orders proceed to `Pending` status without payment verification.

10. **Order Item Snapshot** — Items are stored as a snapshot inside the order document. This means order history remains intact even if a food item is later updated or deleted.

11. **Referral Code Validation** — Codes are validated against existing user records in the database. Invalid codes return a warning but do not block signup.

12. **Single Currency** — All prices are in Nigerian Naira (₦). No multi-currency support.

13. **No Pagination** — `GET /api/foods` returns all available items. Acceptable at current scale.

---

## 📈 Scalability Considerations

### Current Scale (up to ~500 Users)
The current setup handles this comfortably with MongoDB Atlas free tier and Cloudinary free tier.

### Growing Scale (500 → 5,000 Users)
- Add **MongoDB indexes** on `email`, `phone`, `user_id`, `status`, `is_available` — prevents full collection scans
- Add **input validation middleware** using `Joi` or `express-validator` across all endpoints
- Replace Gmail App Password with a dedicated email service like **SendGrid** for better reliability and delivery rates
- Add **pagination** to `GET /api/foods` and `GET /api/orders` as data grows

### Production Scale (5,000 → 10,000+ Users)
- Implement **JWT-based authentication** — replace `user_id` in request body with signed tokens
- Add **Redis caching** for `GET /api/foods` — most-hit endpoint, rarely changes
- Add **rate limiting** (`express-rate-limit`) on signup, verify, and login endpoints to prevent abuse
- Introduce a **message queue** (Bull.js + Redis) for async order notifications — keeps API responses fast
- Separate into **microservices** — User Service, Menu Service, Cart Service, Order Service
- Set up **CI/CD pipelines** (GitHub Actions) for automated testing and deployment
- Add dedicated **dev, staging, and production environments**

---

## 📊 Complete API Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/signup` | Register new user |
| POST | `/api/verify` | Verify OTP |
| POST | `/api/resend-otp` | Resend new OTP |
| POST | `/api/login` | Login with email + password |
| GET | `/api/users/:id` | Get user profile |
| GET | `/api/foods` | Get all available foods |
| POST | `/api/foods` | Add food item (with image) |
| PATCH | `/api/foods/:id` | Update food item |
| DELETE | `/api/foods/:id` | Delete food + Cloudinary image |
| POST | `/api/cart` | Add item to cart |
| GET | `/api/cart/:userId` | View cart |
| PATCH | `/api/cart/update` | Update item quantity |
| DELETE | `/api/cart/item` | Remove single item |
| DELETE | `/api/cart/:userId` | Clear entire cart |
| POST | `/api/orders` | Place order from cart |
| GET | `/api/orders` | Get all orders (Admin) |
| GET | `/api/orders/user/:userId` | Get user's order history |
| GET | `/api/orders/:id` | Get single order details |
| PATCH | `/api/orders/:id/status` | Update order status (Admin) |
| PATCH | `/api/orders/:id/cancel` | Cancel order |
| POST | `/api/ratings` | Submit a review |
| GET | `/api/ratings/food/:foodId` | Get all reviews for a food item |
| GET | `/api/ratings/user/:userId` | Get all reviews by a user |
| PATCH | `/api/ratings/:id` | Edit a review |
| DELETE | `/api/ratings/:id` | Delete a review |

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