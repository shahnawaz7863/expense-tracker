import express from "express";
import { getDashboardSummary,getExpenseByCategory,getMonthlyAnalytics,getRecentTransactions,} from "../controllers/dashboardController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/summary",
  authMiddleware,
  getDashboardSummary
);

router.get(
  "/expenses-by-category",
  authMiddleware,
  getExpenseByCategory
);

router.get(
  "/monthly",
  authMiddleware,
  getMonthlyAnalytics
);

router.get(
  "/recent-transactions",
  authMiddleware,
  getRecentTransactions
);

export default router;