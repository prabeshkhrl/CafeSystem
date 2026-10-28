import express from "express";
import {
  createRestaurant,
  getAllRestaurants,
  getRestaurantById,
  getRestaurantsByOwner,
  updateRestaurant,
  toggleRestaurantActive,
  deleteRestaurant,
} from "../controllers/restaurantController.js";
import {
  requireAuth,
  requireAdmin,requireRole
} from "../middleware/authMiddleware.js";
import { requireRestaurantOwnership } from "../middleware/ownershipMiddleware.js";

const router = express.Router();

// ---------- public ----------
router.get("/", getAllRestaurants);
router.get("/owner/:ownerId", getRestaurantsByOwner);
router.get("/:id", getRestaurantById);

// ---------- protected ----------

// Create: auth required; controller will set ownerId = req.user._id
router.post("/", requireAuth,requireRole("restaurantOwner"), createRestaurant);

// Update: must be owner or admin
router.put(
  "/:id",
  requireAuth,
  requireRestaurantOwnership,
  updateRestaurant
);

// Toggle active: owner or admin
router.patch(
  "/:id/toggle-active",
  requireAuth,
  requireRestaurantOwnership,
  toggleRestaurantActive
);

// Delete: admin only (safer). Change to requireRestaurantOwnership if
// you want owners to delete their own restaurant.
router.delete("/:id", requireAuth, requireRestaurantOwnership, deleteRestaurant);

export default router;