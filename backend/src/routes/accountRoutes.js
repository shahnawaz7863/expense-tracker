import express from "express";
import { createAccount, getAccounts, updateAccount, deleteAccount, } from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import { accountSchema, } from "../validators/accountValidator.js";
import { objectIdSchema } from "../validators/objectIdValidator.js";

const router = express.Router();

router.post("/",
  authMiddleware,
  validate(accountSchema),
  createAccount
);

router.get("/",
  authMiddleware,
  getAccounts
);

router.put(
  "/:id",
  authMiddleware,
  validate(accountSchema),
  validate(objectIdSchema, "params"),
  updateAccount
);

router.delete(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  deleteAccount
);

export default router;