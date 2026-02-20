# Chuks Kitchen — Backend API Documentation

## Table of Contents
1. System Overview
2. Tech Stack
3. Folder Structure
4. Flow Explanation
5. API Endpoints
6. Edge Case Handling
7. Assumptions
8. Data Model
9. Scalability Thoughts
10. How to Run the Project

---

## 1. System Overview

Chuks Kitchen is a digital food ordering platform that allows customers to 
register, browse meals, add items to a cart, and place orders. The admin 
team can manage food items and update order statuses.

The system follows a client-server architecture. The frontend (not built here) 
communicates with this backend by sending HTTP requests. The backend processes 
those requests, interacts with a MongoDB database, and returns JSON responses.

There are two user roles:
- Customer: can browse food, manage cart, and place orders
- Admin: can manage food items and update order statuses

---

## 2. Tech Stack

- Runtime: Node.js
- Framework: Express.js
- Database: MongoDB (with Mongoose ODM)
- Environment Variables: dotenv

---

## 3. Folder Structure

chuks-kitchen-api/
├── config/         → MongoDB connection
├── models/         → Mongoose schemas (User, Food, Cart, Order, Rating)
├── routes/         → API route definitions
├── controllers/    → Business logic for each route
├── middleware/     → Global error handler
├── .env            → Environment variables
├── app.js          → Express setup and route registration
├── server.js       → Entry point
└── README.md       → This file

---

## 4. Flow Explanation

### A. User Registration Flow
The user submits their email or phone number along with an optional referral 
code. The backend first checks if that email or phone already exists in the 
database — if it does, the signup is blocked to prevent duplicate accounts. 
If the referral code is provided, it is validated; an invalid code shows a 
warning but does not stop registration.

Once the user record is saved (with is_verified set to false), a 4-digit OTP 
is generated and stored alongside the user with a timestamp. The user submits 
the OTP and the backend checks if it matches and was created within the last 
10 minutes. On success, is_verified is set to true.

Decision made: OTP expiry is handled server-side to prevent bypass from 
the client.

### B. Browse Food & Add to Cart Flow
The frontend calls GET /foods to retrieve all available food items. When a 
customer adds an item to their cart, the backend confirms the item is still 
marked as available before saving the cart entry. This prevents items that 
became unavailable from entering the cart silently.

### C. Place Order Flow
When a customer places an order, the backend re-validates every item in the 
cart in real time — not just at the point of adding. This protects against 
the case where a food item becomes unavailable between being added to the cart 
and the order being placed. The total price is calculated server-side (never 
trusted from the client) and an order record is created with a starting status 
of "Pending". The cart is then cleared.

Order status moves through: Pending → Confirmed → Preparing → 
Out for Delivery → Completed. Both the customer and admin can trigger 
cancellation under specific conditions.

---

## 5. API Endpoints

### User
| Method | Endpoint      | Description                        |
|--------|---------------|------------------------------------|
| POST   | /api/signup   | Register a new user                |
| POST   | /api/verify   | Verify user OTP                    |

### Food
| Method | Endpoint      | Description                        |
|--------|---------------|------------------------------------|
| GET    | /api/foods    | Get all available food items       |
| POST   | /api/foods    | Add a new food item (Admin)        |

### Cart
| Method | Endpoint           | Description                   |
|--------|--------------------|-------------------------------|
| POST   | /api/cart          | Add item to cart              |
| GET    | /api/cart/:userId  | View cart for a user          |
| DELETE | /api/cart/:userId  | Clear cart for a user         |

### Orders
| Method | Endpoint           | Description                   |
|--------|--------------------|-------------------------------|
| POST   | /api/orders        | Place an order from cart      |
| GET    | /api/orders/:id    | Get order details and status  |

---

## 6. Edge Case Handling

| Edge Case | How It Is Handled |
|-----------|-------------------|
| Duplicate email/phone at signup | Backend queries DB before saving; returns 400 error if found |
| Invalid referral code | Warning returned in response, signup still continues |
| Expired OTP | OTP stored with createdAt timestamp; rejected if older than 10 minutes |
| Invalid OTP | Compared against stored value; returns 400 error if mismatch |
| User abandons signup midway | User record saved as unverified; they can resume verification later |
| Food item unavailable when added to cart | Backend checks is_available before adding; returns error if false |
| Food becomes unavailable after added to cart | Re-validated at order placement; order blocked if any item is unavailable |
| Customer cancels order | Allowed only when status is Pending or Confirmed |
| Admin cancels order | Allowed at any stage before Completed; customer is notified |
| Payment not completed | Order stays Pending; assumed to time out (payment integration out of scope) |

---

## 7. Assumptions

- OTP is a randomly generated 4-digit number (simulated — no real email service used)
- OTP expires after 10 minutes
- Payment processing is out of scope; orders proceed without real payment validation
- There is no authentication/JWT system — user_id is passed directly in requests 
  as specified in the deliverable brief
- One active cart per user at a time
- Admin access is simulated — any POST to /api/foods acts as an admin action
- Referral code validation checks against a predefined list or existing user codes

---

## 8. Data Model

### User
| Field        | Type    | Description                        |
|--------------|---------|------------------------------------|
| _id          | ObjectId| Auto-generated unique ID           |
| name         | String  | Full name                          |
| email        | String  | Unique email address               |
| phone        | String  | Unique phone number                |
| referral_code| String  | Optional referral code used        |
| otp          | String  | Generated OTP code                 |
| otp_expires  | Date    | OTP expiry timestamp               |
| is_verified  | Boolean | Whether account is verified        |
| created_at   | Date    | Account creation timestamp         |

### Food Item
| Field        | Type    | Description                        |
|--------------|---------|------------------------------------|
| _id          | ObjectId| Auto-generated unique ID           |
| name         | String  | Food name                          |
| description  | String  | Short description                  |
| price        | Number  | Price in Naira                     |
| category     | String  | e.g., Rice, Soup, Drinks           |
| is_available | Boolean | Whether item is currently available|
| image_url    | String  | Link to food image                 |

### Cart
| Field        | Type    | Description                        |
|--------------|---------|------------------------------------|
| _id          | ObjectId| Auto-generated unique ID           |
| user_id      | ObjectId| References User                    |
| items        | Array   | List of {food_id, quantity, price} |
| created_at   | Date    | Cart creation timestamp            |

### Order
| Field        | Type    | Description                        |
|--------------|---------|------------------------------------|
| _id          | ObjectId| Auto-generated unique ID           |
| user_id      | ObjectId| References User                    |
| items        | Array   | List of {food_id, quantity, price} |
| total_price  | Number  | Calculated total                   |
| status       | String  | Pending/Confirmed/Preparing/etc.   |
| created_at   | Date    | Order creation timestamp           |
| updated_at   | Date    | Last status update timestamp       |

### Rating
| Field        | Type    | Description                        |
|--------------|---------|------------------------------------|
| _id          | ObjectId| Auto-generated unique ID           |
| user_id      | ObjectId| References User                    |
| order_id     | ObjectId| References Order                   |
| food_id      | ObjectId| References Food Item               |
| score        | Number  | Rating from 1 to 5                 |
| comment      | String  | Optional review text               |

---

## 9. Scalability Thoughts

At 100 users, the current setup works well. As users grow to 10,000+, 
the following changes would be necessary:

- **Database**: Move from a local MongoDB instance to MongoDB Atlas with 
  proper indexing on frequently queried fields like email, user_id, and status
- **Authentication**: Add JWT-based authentication so every request is 
  verified securely
- **OTP Service**: Replace simulated OTP with a real service like Twilio 
  (SMS) or SendGrid (email)
- **Caching**: Use Redis to cache the food menu so GET /foods doesn't hit 
  the database on every request
- **Queue System**: Use a message queue (like Bull or RabbitMQ) to handle 
  order notifications asynchronously instead of inline
- **Environment Separation**: Maintain separate dev, staging, and production 
  environments

---

## 10. How to Run the Project

1. Clone the repository
2. Run: npm install
3. Create a .env file with:
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
4. Run in development mode: npm run dev
5. Test endpoints using Postman at http://localhost:5000

---

Built by: Emmanuelah Bello  
Internship: Trueminds Innovations Ltd  
Deliverable: Backend Developer — Personal Deliverable 1