import express from "express";
import {
  registerCustomer,
  registerRestaurantOwner,
  registerAdmin,
  loginUser,
} from "../controllers/authController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// public
router.post("/register/customer", registerCustomer);
router.post("/register/restaurant", registerRestaurantOwner);
router.post("/login", loginUser);

// owner-only
router.post(
  "/register/admin",
  requireAuth,
  requireRole("restaurantOwner"),
  registerAdmin
);

export default router;