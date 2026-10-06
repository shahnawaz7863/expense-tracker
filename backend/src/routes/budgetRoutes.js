import express from "express";
import {createBudget,getBudgets,updateBudget,deleteBudget,} from "../controllers/budgetController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {budgetSchema,} from "../validators/budgetValidator.js";
import { objectIdSchema } from "../validators/objectIdValidator.js";

const router = express.Router();

router.post("/",
  authMiddleware,
  validate(budgetSchema),
  createBudget
);

router.get("/",
  authMiddleware,
  getBudgets
);

router.put(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  validate(budgetSchema),
  updateBudget
);

router.delete(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  deleteBudget
);

export default router;