# 💰 Expense Tracker – MERN Stack

A full-stack Expense Tracker web application built using the MERN stack. It helps users manage personal finances, track income and expenses, manage budgets, and monitor their financial activities through an interactive dashboard.

## 🌐 Live Demo

- **Frontend:** [Expense Tracker Live](https://expense-tracker-shahnawaz13.vercel.app/)
- **Backend API:** [Expense Tracker API](https://expense-tracker-api-zit6.onrender.com/)
- **GitHub Repository:** [View Source Code](https://github.com/shahnawaz7863/expense-tracker)

## ✨ Features

- User registration and login
- Secure JWT authentication
- Password hashing using bcrypt
- Dashboard with income, expenses and balance
- Transaction CRUD operations
- Server-side pagination
- Income and expense categories
- Multiple accounts and wallets
- Budget management
- Savings goals
- Recurring transactions
- CSV transaction export
- Expense and income analytics
- Responsive user interface
- Backend validation using Joi
- Authentication rate limiting
- Helmet security headers
- Restricted CORS
- Centralized error handling
- Automated backend and frontend tests

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router
- Axios
- Bootstrap
- Recharts
- Lucide React
- Vite
- Vitest
- React Testing Library

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Joi
- Helmet
- Express Rate Limit
- node-cron
- json2csv
- Jest
- Supertest

### Deployment & Database
- Vercel – Frontend Hosting
- Render – Backend Hosting
- MongoDB Atlas – Cloud Database

## 📁 Project Structure

```text
expense-tracker/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── __tests__/
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── context/
│       │   ├── pages/
│       │   ├── services/
│       │   └── test/
│       ├── .env.example
│       └── package.json
│
└── README.md
```

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/shahnawaz7863/expense-tracker.git

cd expense-tracker
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
CLIENT_URL=http://localhost:5173
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend/frontend
npm install
```

Create a `.env` file inside the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## 🔐 Security

- Passwords are hashed using bcrypt.
- JWT is used for authentication.
- Joi validates backend request data.
- Helmet adds security-related HTTP headers.
- Rate limiting protects authentication endpoints.
- CORS restricts allowed frontend origins.
- Environment variables protect sensitive configuration.

**Never commit `.env` files, database credentials, or JWT secrets to GitHub.**

## 👨‍💻 Author

**Shahnawaz Ahmad**

- GitHub: [shahnawaz7863](https://github.com/shahnawaz7863)

---

⭐ If you find this project useful, consider giving it a star on GitHub.