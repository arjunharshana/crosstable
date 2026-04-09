# ♟️ CrossTable

> **Enterprise-Grade Chess Tournament Management & Broadcasting Platform.**

CrossTable is a definitive, full-stack platform designed for professional chess arbiters, organizers, and players. It streamlines the complexities of FIDE-rated tournament administration, offering automated pairings, regulatory tie-break compliance, live data broadcasting, and comprehensive player analytics.

---

## ✨ Key Features

* **Automated Pairings:** Instant generation for Swiss, Round-Robin, and Arena formats with zero latency.
* **Regulatory Compliance:** Built-in Buchholz and Sonneborn-Berger tie-break calculations matching official FIDE handbooks.
* **Live Match Ledger:** Dynamic player dashboards tracking performance, win/loss ratios, and historical match data.
* **Official Rating Sync:** Seamless integration to pull and verify official FIDE and Chess.com Elo ratings.
* **Arbiter Dashboard:** Total control over the bracket—override results, resolve disputes, and manage late-joins.
* **Player Profiles:** Public and private profiles featuring a visual Trophy Room, dynamic rating charts, and verified FIDE status badges.

---

## 🛠 Tech Stack

**Frontend**
* [React 18](https://react.dev/) (via Vite)
* [TypeScript](https://www.typescriptlang.org/) for strict type safety
* [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
* [Framer Motion](https://www.framer.com/motion/) for fluid animations
* [React Router](https://reactrouter.com/) for navigation

**Backend**
* [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) for database architecture
* JWT (JSON Web Tokens) for secure authentication
* RESTful API architecture

---

## 🚀 Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites
* Node.js (v18 or higher recommended)
* MongoDB (Local instance or MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone https://github.com/arjunharshana/crosstable.git
cd crosstable
```

### 2. Install Dependencies
You will need to install dependencies for both the frontend and backend environments.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Environment Variables
Create a `.env` file in both the `frontend` and `backend` directories.

**`backend/.env`**
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

**`frontend/.env`**
```
VITE_API_URL=http://localhost:5000/api
```

### 4. Run the Application
Open two terminal windows to run both servers simultaneously.

**Terminal 1 (Backend):**
```
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (or the port specified by Vite).


## 📂 Project Structure

```text
crosstable/
├── .github/                 # GitHub Actions workflows & configurations
├── backend/                 # Node.js / Express backend
│   ├── src/
│   │   ├── config/          # Database and environment configurations
│   │   ├── controllers/     # Request handlers and business logic
│   │   ├── middleware/      # Custom Express middlewares (auth, validation)
│   │   ├── models/          # Mongoose database schemas
│   │   ├── routes/          # Express API route definitions
│   │   ├── utils/           # Helper functions and utilities
│   │   ├── app.ts           # Express application setup
│   │   └── server.ts        # Server entry point
│   ├── docker-compose.yml   # Multi-container Docker orchestration
│   ├── Dockerfile           # Docker image configuration for the backend
│   ├── package.json         # Backend dependencies and scripts
│   └── tsconfig.json        # TypeScript configuration
│
└── frontend/                # React / Vite frontend
    ├── src/
    │   ├── components/      # Reusable UI elements (Logo, ThemeToggle, etc.)
    │   ├── context/         # React Context providers (AuthContext)
    │   ├── hooks/           # Custom React hooks (useAuth)
    │   ├── pages/           # Route components (Home, Dashboard, Profile, etc.)
    │   ├── services/        # API configuration (Axios instances)
    │   ├── App.tsx          # Main application router
    │   └── main.tsx         # React entry point
    ├── tailwind.config.ts   # Tailwind CSS design system configuration
    ├── vercel.json          # Vercel deployment routing & configuration
    ├── vite.config.ts       # Vite bundler configuration
    └── package.json         # Frontend dependencies and scripts

```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve CrossTable, please follow these steps:
1. Fork the repository.
2. Create a new branch (`git checkout -b feat/your-name`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feat/your-name`).
5. Open a Pull Request.

---

Copyright © 2026 CrossTable. All Rights Reserved.

---
*Built for the love of the game.*
