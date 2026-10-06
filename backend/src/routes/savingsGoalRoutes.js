import express from "express";
import {createSavingsGoal,getSavingsGoals,updateSavingsGoal,deleteSavingsGoal,} from "../controllers/savingsGoalController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {savingsGoalSchema,} from "../validators/savingsGoalValidator.js";
import { objectIdSchema } from "../validators/objectIdValidator.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  validate(savingsGoalSchema),
  createSavingsGoal
);

router.get(
  "/",
  authMiddleware,
  getSavingsGoals
);

router.put(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  validate(savingsGoalSchema),
  updateSavingsGoal
);

router.delete(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  deleteSavingsGoal
);

export default router;