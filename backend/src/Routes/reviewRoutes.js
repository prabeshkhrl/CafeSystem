import express from "express";
import {
  createReview,
  getRestaurantReviews,
  getMyReviews,
  getReviewById,
  updateReview,
  deleteReview,
  replyToReview,
  toggleHideReview,
} from "../controllers/reviewController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// public
router.get("/restaurant/:restaurantId", getRestaurantReviews);
router.get("/:id", getReviewById);

// authenticated
router.use(requireAuth);
router.post("/", createReview);
router.get("/my", getMyReviews);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);
router.patch("/:id/reply", replyToReview);
router.patch("/:id/hide", toggleHideReview);

export default router;