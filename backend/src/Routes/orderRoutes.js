import express from "express";
import {
  createOrder,
  getMyOrders,
  getRestaurantOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  updatePaymentStatus,
} from "../controllers/orderController.js";
import { requireAuth } from "../Middleware/authMiddleware.js";

const router = express.Router();

// all order routes require login
router.use(requireAuth);

router.post("/", createOrder);
router.get("/my", getMyOrders);
router.get("/restaurant/:restaurantId", getRestaurantOrders);
router.get("/:id", getOrderById);

router.patch("/:id/status", updateOrderStatus);
router.patch("/:id/cancel", cancelOrder);
router.patch("/:id/payment", updatePaymentStatus);

export default router;