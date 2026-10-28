import express from "express";
import {
  createMenuItem,
  getAllMenuItems,
  getMenuItemsByRestaurant,
  getMenuItemById,
  updateMenuItem,
  toggleMenuItemAvailability,
  deleteMenuItem,
} from "../controllers/menuController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import {
  requireCreateMenuItemOwnership,
  requireMenuItemOwnership,
} from "../middleware/ownershipMiddleware.js";

const router = express.Router();

// ---------- public ----------
router.get("/", getAllMenuItems);
router.get("/restaurant/:restaurantId", getMenuItemsByRestaurant);
router.get("/:id", getMenuItemById);

// ---------- protected ----------
router.post(
  "/",
  requireAuth,
  requireCreateMenuItemOwnership,
  createMenuItem
);

router.put(
  "/:id",
  requireAuth,
  requireMenuItemOwnership,
  updateMenuItem
);

router.patch(
  "/:id/toggle-availability",
  requireAuth,
  requireMenuItemOwnership,
  toggleMenuItemAvailability
);

router.delete(
  "/:id",
  requireAuth,
  requireMenuItemOwnership,
  deleteMenuItem
);

export default router;