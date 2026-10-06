\# Expense Tracker



A full-stack Expense Tracker web application built using the MERN stack.



\## Features



\- User registration and login

\- JWT authentication

\- Password hashing with bcrypt

\- Dashboard with income, expenses and balance

\- Transaction CRUD operations

\- Server-side pagination

\- Transaction search and filters

\- Income and expense categories

\- Multiple accounts/wallets

\- Budget management

\- Savings goals

\- Recurring transactions

\- CSV transaction export

\- Expense and income analytics

\- Responsive UI

\- Backend validation using Joi

\- Authentication rate limiting

\- Helmet security headers

\- Restricted CORS

\- Centralized error handling

\- Automated backend and frontend tests



\## Tech Stack



\### Frontend



\- React

\- React Router

\- Axios

\- Bootstrap

\- Recharts

\- Lucide React

\- Vite

\- Vitest

\- React Testing Library



\### Backend



\- Node.js

\- Express.js

\- MongoDB

\- Mongoose

\- JWT

\- bcryptjs

\- Joi

\- Helmet

\- Express Rate Limit

\- node-cron

\- json2csv

\- Jest

\- Supertest



\## Project Structure



```text

expense-tracker/

├── backend/

│   ├── src/

│   │   ├── controllers/

│   │   ├── middleware/

│   │   ├── models/

│   │   ├── routes/

│   │   ├── utils/

│   │   ├── validators/

│   │   └── \_\_tests\_\_/

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

