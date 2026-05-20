# Emerald Bites - Online Food Delivery App 🍔

A modern, full-stack food ordering and delivery application built with the MERN stack. It features a beautiful, highly responsive user interface designed to provide a seamless online ordering experience for a premium restaurant.

🌍 **Live Demo**
*   **Frontend (Vercel):** [https://emeraldbites.vercel.app/](https://emeraldbites.vercel.app/)
*   **Backend API (Render):** [https://future-fs-03-hns9.onrender.com](https://future-fs-03-hns9.onrender.com)

---

## 🛠️ Tech Stack

### Frontend (`/frontend`)
*   **Framework:** React + Vite
*   **Routing:** React Router
*   **Styling:** Custom CSS3 with Glassmorphism UI
*   **Animations:** CSS Transitions & Keyframes
*   **Notifications:** React Toastify

### Backend (`/backend`)
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs
*   **CORS:** Node CORS

---

## 📁 Project Structure

```
LocalBites/
├── frontend/               # React frontend application
│   ├── src/                # Components, pages, assets, and services
│   ├── .env                # Frontend environment variables
│   └── vercel.json         # Vercel deployment & SPA rewrite rules
├── backend/                # Express backend API
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # Express API routes
│   ├── .env                # Backend environment variables
│   └── server.js           # Main server entry point
└── README.md
```

---

## 🚀 Features

*   **Role-Based Access Control (RBAC):** Distinct experiences for standard Users and Administrators.
*   **Dynamic Product Menu:** Browse food items by category, with real-time search and filtering.
*   **Shopping Cart:** Add, view, and manage items in a persistent shopping cart.
*   **Full Checkout Process:** Securely place orders with address details and payment method selection.
*   **Order Management:** Users can view their order history, and admins can manage all incoming orders.
*   **Admin Dashboard:** A dedicated section for administrators to oversee application data.
*   **Modern & Responsive UI/UX:** A premium, mobile-first design with glassmorphism effects, smooth animations, and a clean layout for all screen sizes.
*   **Automatic Database Seeding:** The backend automatically populates the database with an initial set of products if it's empty.

---

## 💻 Local Development

### Prerequisites
*   Node.js (v18+)
*   MongoDB (a local instance or a free Atlas Cluster)

### 1. Install Dependencies
Navigate to the backend and frontend directories to install their respective dependencies:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `/backend` directory:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
FRONTEND_URL=http://localhost:5173
```

Create a `.env` file in the `/frontend` directory:
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application
Start the Backend Server (from the `/backend` directory):
```bash
npm run dev
```

Start the Frontend Client (from the `/frontend` directory):
```bash
npm run dev
```
The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

---

## 👤 Author
**Vinod Kumar Banothu**
*   **GitHub:** https://github.com/banothuvinodkumar
*   **LinkedIn:** https://www.linkedin.com/in/vinod-kumar-banothu-559a14325
*   **Email:** itsvinodkumarcse@gmail.com