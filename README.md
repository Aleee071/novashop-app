# 🛍️ MERN E-Commerce App

A full-featured and scalable E-Commerce web application built with the MERN stack. It supports user and owner authentication, dynamic product listings, cart management, and owner-specific product control — all integrated via custom hooks and Redux Toolkit.

---

## 🖼️ Demo

[https://novashop-app.vercel.app/]

## ✨ Features

- 🔐 **JWT-based Authentication** (User & Owner)
- 🛒 **Cart Management** with Quantity Updates and Item Removal
- 📦 **Product Listings and Details** Page
- 🧑‍💼 **Owner Dashboard** for Product Uploading and Management
- 🎯 **Role-based Data Fetching** with Dynamic Routing
- 🍪 **HttpOnly Cookie** Handling for Security
- ⚙️ **REST API Integration** using Axios
- 🪝 **Custom React Hooks** for data fetching and side effects
- 📦 **Redux Toolkit** for Predictable Global State Management
- 💅 **Tailwind CSS** for Responsive and Modern UI
- 📈 **Toast Notifications** with `react-hot-toast`

---

## 🧱 Tech Stack

### 🔹 Frontend
- React.js (with Vite)
- Redux Toolkit
- Tailwind CSS
- Axios
- React Router DOM
- react-hot-toast

### 🔹 Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JSON Web Tokens (JWT)

### 🔹 Hosting
- Vercel (For frontend)
- Railway (For backend)

---

## ⚙️ Backend Overview

The backend is a **RESTful API** built using **Express.js** and **MongoDB**, designed to serve both regular users and product owners.

### API Highlights:
- `POST /api/auth/register` – User & Owner registration
- `POST /api/auth/login` – Login with JWT token returned in HttpOnly cookie
- `GET /api/auth/user` - Get the currently logged-in user
- `POST /api/auth/logout` - Logout currently logged-in user
- `POST /api/change-password` - Change current password
- `GET /api/products` – Get all products
- `GET /api/products/product/:id` - Get a single product through its ID 
- `POST /api/products/create` - (Owner only) Create new product
- `DELETE /api/products/delete/:id` - (Owner only) Delete a product through its ID
- `PUT /api/products/update/:id` - (owner only) Update product details
- `GET /api/products/owner` - Get products by owner
- `GET /api/cart` – Get user's cart
- `POST /api/cart/add/:id` - Add product into cart
- `POST /api//cart/clearCart` - Clears cart
- `PATCH /api/cart/:id` – Update quantity
- `DELETE /api/cart/remove/:id` – Remove item from cart
- `DELETE /api/cart/deleteCart` - Deletes cart
- `POST /api/orders/create` - (User only) Create an order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/owner-orders` - (Owner only) Get orders by owner
- `GET /api/orders/my-orders` - (User only) Get orders by user
- `PATCH /api/orders/status/:id` - (Owner only) Update order's status
- `DELETE /api/orders/delete/:id` - (User only) Deletes an order

_All protected routes are secured via JWT middleware and role-based access._

---

## 🔁 Custom Hooks Used

- `useInitialFetch()` – Centralized logic for fetching user/owner, products, and cart
- `useFetchCart()` – Isolated cart refetch logic
- (and many more....)

---

## 🚀 Getting Started

### 📦 Prerequisites

- Node.js
- MongoDB
- Vite (for frontend)

### 🔧 Installation

#### 📁 Environment Variables

# 🔧 Frontend (.env):
VITE_API_BASE_URL="http://localhost:xxxx/api"
VITE_REACT_BASE_URL="http://localhost:xxxx"

# 🔧 Backend (.env):
PORT=XXXX
MONGO_URI=your_mongodb_uri
CORS_ORIGIN=""
ACCESS_TOKEN_JWT_SECRET=""
REFRESH_TOKEN_JWT_SECRET=""

```bash
# Clone the repository
git clone https://github.com/Aleee071/novashop-app.git

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
