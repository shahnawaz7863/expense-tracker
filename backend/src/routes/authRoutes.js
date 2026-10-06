import express from "express";
import {register,login,getMe,} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import validate from "../middleware/validateMiddleware.js";
import {registerSchema,loginSchema,} from "../validators/authValidator.js";
import authRateLimiter from "../middleware/authRateLimiter.js";

const router = express.Router();

router.post("/register",
  authRateLimiter,
  validate(registerSchema),
  register
);
router.post("/login",
  authRateLimiter,
  validate(loginSchema),
  login
);

router.get("/me",
  authMiddleware,
  getMe
);

export default router;