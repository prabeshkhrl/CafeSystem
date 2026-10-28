import mongoose from "mongoose";
import Review from "../Models/reviewModel.js";
import Order from "../Models/orderModel.js";
import Restaurant from "../Models/restaurantModel.js";
import { deleteCloudinaryImages } from "../lib/cloudinary.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleError = (err, res) => {
  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "You have already reviewed this order",
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}`,
    });
  }
  console.error(err);
  return res.status(500).json({ success: false, message: "Internal server error" });
};

/* ================================================================== */
/* CREATE REVIEW                                                       */
/* POST /api/reviews                                                   */
/* Body: { orderId, rating, foodRating?, deliveryRating?,              */
/*         serviceRating?, comment?, images?[] }                       */
/* ================================================================== */
export const createReview = async (req, res) => {
  try {
    const {
      orderId,
      rating,
      foodRating,
      deliveryRating,
      serviceRating,
      comment,
      images,
    } = req.body;

    if (!orderId || !isValidId(orderId)) {
      return res
        .status(400)
        .json({ success: false, message: "Valid orderId is required" });
    }
    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ success: false, message: "rating must be between 1 and 5" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // only the customer who placed it can review
    if (order.customerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You can only review your own orders" });
    }

    // must be delivered
    if (order.status !== "delivered") {
      return res.status(400).json({
        success: false,
        message: "You can only review delivered orders",
      });
    }

    // one review per order (also enforced by unique index)
    const existing = await Review.findOne({ orderId });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, message: "This order has already been reviewed" });
    }

    const review = await Review.create({
      orderId,
      customerId: req.user._id,
      restaurantId: order.restaurantId,
      menuItemIds: order.items.map((i) => i.menuItemId),
      rating,
      foodRating: foodRating ?? null,
      deliveryRating: deliveryRating ?? null,
      serviceRating: serviceRating ?? null,
      comment: comment || "",
      images: Array.isArray(images) ? images : [],
    });

    // link back from order
    order.reviewId = review._id;
    await order.save();

    return res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* GET REVIEWS FOR A RESTAURANT                                        */
/* GET /api/reviews/restaurant/:restaurantId?page=&limit=&minRating=   */
/* ================================================================== */
export const getRestaurantReviews = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { page = 1, limit = 10, minRating } = req.query;

    if (!isValidId(restaurantId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid restaurantId" });
    }

    const filter = { restaurantId, isHidden: false };
    if (minRating) filter.rating = { $gte: Number(minRating) };

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [reviews, total] = await Promise.all([
      Review.find(filter)
        .populate("customerId", "name username")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Review.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: reviews,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* GET MY REVIEWS                                                      */
/* GET /api/reviews/my                                                 */
/* ================================================================== */
export const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ customerId: req.user._id })
      .populate("restaurantId", "name restaurantLogo")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* GET REVIEW BY ID                                                    */
/* GET /api/reviews/:id                                                */
/* ================================================================== */
export const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(id)
      .populate("customerId", "name username")
      .populate("restaurantId", "name restaurantLogo")
      .populate("menuItemIds", "name price");

    if (!review || review.isHidden) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({ success: true, data: review });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* UPDATE OWN REVIEW                                                   */
/* PUT /api/reviews/:id                                                */
/* Body: { rating?, foodRating?, deliveryRating?, serviceRating?,      */
/*         comment?, images? }                                         */
/* ================================================================== */
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review || review.isHidden) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (review.customerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You can only edit your own review" });
    }

    const allowed = [
      "rating",
      "foodRating",
      "deliveryRating",
      "serviceRating",
      "comment",
      "images",
    ];
    for (const key of allowed) {
      if (req.body[key] !== undefined) review[key] = req.body[key];
    }
    review.isEdited = true;
    review.editedAt = new Date();

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated",
      data: review,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* DELETE OWN REVIEW                                                   */
/* DELETE /api/reviews/:id                                             */
/* ================================================================== */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    const isOwnerOfReview =
      review.customerId.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwnerOfReview && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not allowed to delete this review",
      });
    }
   
    // 🔥 Delete photos from Cloudinary BEFORE removing the Mongo doc
    if (review.images?.length) {
     await deleteCloudinaryImages(review.images);
       
    }

    // Unlink from order
    await Order.updateOne(
      { _id: review.orderId },
      { $set: { reviewId: null } }
    );

    await review.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (err) {
    console.error("deleteReview error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


/* ================================================================== */
/* OWNER REPLY TO REVIEW                                               */
/* PATCH /api/reviews/:id/reply                                        */
/* Body: { text }                                                      */
/* Owner or scoped admin of the restaurant only.                      */
/* ================================================================== */
export const replyToReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res
        .status(400)
        .json({ success: false, message: "Reply text is required" });
    }
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review || review.isHidden) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // check ownership
    const restaurant = await Restaurant.findById(review.restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    const userId = req.user._id.toString();
    const isOwner = restaurant.ownerId.toString() === userId;
    const isScopedAdmin =
      req.user.role === "admin" &&
      req.user.restaurantId &&
      req.user.restaurantId.toString() === restaurant._id.toString();

    if (!isOwner && !isScopedAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the restaurant owner or an admin can reply",
      });
    }

    review.ownerReply = {
      text: text.trim(),
      repliedBy: req.user._id,
      repliedAt: new Date(),
    };
    await review.save();

    return res.status(200).json({
      success: true,
      message: "Reply added",
      data: review,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* HIDE / UNHIDE REVIEW (admin moderation)                             */
/* PATCH /api/reviews/:id/hide                                         */
/* Body: { hide: true|false, reason? }                                 */
/* ================================================================== */
export const toggleHideReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { hide, reason = "" } = req.body;

    if (typeof hide !== "boolean") {
      return res
        .status(400)
        .json({ success: false, message: "hide must be true or false" });
    }
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    // scoped admin of this restaurant only
    const isScopedAdmin =
      req.user.role === "admin" &&
      req.user.restaurantId &&
      req.user.restaurantId.toString() === review.restaurantId.toString();

    if (!isScopedAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Admin access required" });
    }

    review.isHidden = hide;
    review.hiddenReason = hide ? reason : "";
    await review.save();

    return res.status(200).json({
      success: true,
      message: hide ? "Review hidden" : "Review restored",
      data: review,
    });
  } catch (err) {
    return handleError(err, res);
  }
};