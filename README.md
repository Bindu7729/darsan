# DarshanEase 🕉️ – Temple Darshan Booking & Review Platform

A premium, modern full-stack MERN Stack web application designed like a modern SaaS product, offering devotees a seamless way to discover temples, book darshan slots, write reviews, and verify entries.

### 🌐 Live Deployment Links
*   **Website (Frontend):** [https://frontend-bindu295.vercel.app](https://frontend-bindu295.vercel.app)
*   **API Service (Backend):** [https://backend-opal-iota-43.vercel.app/api/health](https://backend-opal-iota-43.vercel.app/api/health)

---

## 📋 Project Overview
DarshanEase transforms the spiritual pilgrimage experience. By combining a clean, modern soft-UI aesthetic (featuring warm saffrons, gold highlights, and clean typography) with robust transaction booking workflows, the platform provides devotees, organizers, and administrators a single place to coordinate sacred visits.

---

## ✨ Key Features
*   **🔐 Secure Authentication & Session Interception** — Secure registration & login powered by JSON Web Tokens (JWT) and BCrypt hashing. Frontend features an auto-redirect interceptor that handles token expiration cleanly.
*   **🔍 Pan-India Smart Search Engine** — Search for historic shrines across India by temple name, city, state, or presiding deity (e.g., searching "Shiva" or "Kerala" instantly filters matches).
*   **🎫 Darshan Pass Transaction System** — Select travel dates, count accompanying devotees, and instantly book VIP or Regular passes. Generates custom digital booking passes.
*   **✍️ Devotee Reviews & Ratings** — Live crowdsourced rating system where authenticated users post ratings and feedback to assist fellow pilgrims with travel tips, dress codes, and timing advice.
*   **🎟️ Organizer Barcode Check-in Scanner** — Specialized dashboard for temple staff to quickly check in devotees by entering/scanning their booking pass code.
*   **⚙️ Administrator Console** — Control tower enabling admins to adjust user access levels (Devotee ↔ Organizer ↔ Admin) and create new temple listings with descriptions, timings, and travel tips.

---

## 🛠️ Technology Stack

### Frontend
*   **React 19** – UI library
*   **Vite 8** – Next-generation client builder
*   **Tailwind CSS v4** – Modern, utility-first visual styling
*   **Framer Motion** – Micro-animations and layout transitions
*   **Axios** – Global request client with auto-authorization interceptors
*   **Lucide React** – Clean vector outline iconography
*   **React Router 7** – Single Page Application routing & route protection

### Backend & Database
*   **Node.js & Express.js** – Operational web framework
*   **MongoDB Atlas** – Cloud relational database clustering
*   **Mongoose** – Object Data Modeling (ODM) layer
*   **JSON Web Tokens (JWT)** – State-free security tokens

---

## 🚀 Quick Start

### Prerequisites
*   Node.js (v18+ recommended)
*   MongoDB Atlas cluster database instance
*   Vercel Account (for deployment)

### Local Development Setup

#### 1. Clone & Setup Repository
```bash
git clone https://github.com/Bindu7729/darsan.git
cd darsan
```

#### 2. Run Backend
1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_signing_key
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *The backend will boot on port `5000`.*
4. *(Optional)* Seed initial pan-India temple records by posting to: `http://localhost:5000/api/temples/seed`

#### 3. Run Frontend
1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Run the client dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Command Reference

### Frontend
```bash
npm install         # Install client dependencies
npm run dev         # Start client dev server (port 5173)
npm run build       # Compile frontend static bundles for Vercel
npm run lint        # Check code quality & syntax guidelines
```

### Backend
```bash
npm install         # Install server dependencies
npm run dev         # Start server with Nodemon (port 5000)
npm start           # Run server in production mode
```

---

## 🏗️ Project Structure
```markdown
darsan/
├── backend/                     # Express.js REST API
│   ├── middleware/              # JWT auth and roles guards
│   ├── models/                  # Mongoose Schemas (User, Temple, Booking, Review)
│   ├── routes/                  # API endpoint routers (auth, temples, bookings)
│   ├── vercel.json              # Serverless configuration for Vercel backend
│   ├── server.js                # Core API entry point
│   └── package.json
│
├── frontend/                    # Vite React SPA Client
│   ├── public/                  # Static public assets & temple custom images
│   ├── src/
│   │   ├── assets/              # Client-side image collections
│   │   ├── components/          # Global UI elements (Navbar, Footer, ProtectedRoute)
│   │   ├── pages/               # Page layouts (Home, Explore, Bookings, Dashboards)
│   │   ├── utils/               # Axios API config with JWT auto-injectors
│   │   ├── App.jsx              # Client routing tree
│   │   └── main.jsx             # React client bootstrap node
│   ├── vercel.json              # Vercel static router rewrite rules (SPA mapping)
│   └── package.json
│
└── README.md                    # Project documentation
```

---

## 📄 License
This project is private and owned by **Bindu7729**. Contact the project owner for usage rights.

Happy Devotional Journeys! 🕉️✨
