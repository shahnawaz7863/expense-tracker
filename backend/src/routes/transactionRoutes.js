import express from "express";
import {createTransaction,getTransactions,updateTransaction,deleteTransaction,exportTransactionsCSV,} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {transactionSchema,} from "../validators/transactionValidator.js";
import { transactionQuerySchema } from "../validators/transactionQueryValidator.js";
import { objectIdSchema } from "../validators/objectIdValidator.js";

const router = express.Router();

router.get(
  "/export/csv",
  authMiddleware,
  exportTransactionsCSV
);

router.post("/",
  authMiddleware,
  validate(transactionSchema),
  createTransaction
);

router.get("/",
  authMiddleware,
  validate(transactionQuerySchema, "query"),
  getTransactions
);

router.put(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  validate(transactionSchema),
  updateTransaction
);

router.delete(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  deleteTransaction
);

export default router;