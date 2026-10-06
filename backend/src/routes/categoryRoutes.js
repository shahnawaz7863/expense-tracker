import express from "express";
import {createCategory,getCategories,updateCategory,deleteCategory,} from "../controllers/categoryController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {categorySchema,} from "../validators/categoryValidator.js";
import { objectIdSchema } from "../validators/objectIdValidator.js";

const router = express.Router();

router.post("/",
  authMiddleware,
  validate(categorySchema),
  createCategory
);

router.get("/",
  authMiddleware,
  getCategories
);

router.put(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  validate(categorySchema),
  updateCategory
);

router.delete(
  "/:id",
  authMiddleware,
  validate(objectIdSchema, "params"),
  deleteCategory
);

export default router;