import express from "express";
import helmet from "helmet";
//import mongoSanitize from "express-mongo-sanitize";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import savingsGoalRoutes from "./routes/savingsGoalRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";

const app = express();

app.use(helmet());
//app.use(mongoSanitize());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json({ limit: "10kb" }));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Expense Tracker API is running",
  });
});
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/savings-goals", savingsGoalRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(errorMiddleware);

export default app;