import mongoose from "mongoose";
import Restaurant from "../Models/restaurantModel.js";
import MenuModel from "../Models/menuModel.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * requireRestaurantOwnership
 * --------------------------
 * Loads the restaurant from `req.params.id` (or `req.body.restaurantId`)
 * and allows the request only if:
 *   - req.user.role === "admin", OR
 *   - restaurant.ownerId equals req.user._id
 *
 * Attaches req.restaurant for reuse in the controller.
 *
 * Usage:
 *   router.put("/:id", requireAuth, requireRestaurantOwnership, updateRestaurant)
 */
export const requireRestaurantOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Auth required" });
    }

    const restaurantId = req.params.id || req.body.restaurantId;
    if (!isValidId(restaurantId)) {
      return res.status(400).json({ success: false, message: "Invalid restaurantId" });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }

    // owner of the restaurant
    const isOwner = restaurant.ownerId.toString() === req.user._id.toString();

    // admin scoped to this restaurant
    const isScopedAdmin =
      req.user.role === "admin" &&
      req.user.restaurantId &&
      req.user.restaurantId.toString() === restaurant._id.toString();

    if (!isOwner && !isScopedAdmin) {
      return res.status(403).json({
        success: false,
        message: "Only the owner or an admin of this restaurant can perform this action",
      });
    }

    req.restaurant = restaurant;
    next();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/**
 * requireMenuItemOwnership
 * ------------------------
 * Loads the menu item from `req.params.id`, then checks that the
 * item's parent restaurant is owned by req.user OR req.user is admin.
 *
 * Attaches req.menuItem and req.restaurant for the controller.
 *
 * Usage:
 *   router.put("/:id", requireAuth, requireMenuItemOwnership, updateMenuItem)
 */
export const requireMenuItemOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    const { id } = req.params;
    if (!id || !isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid menu item ID" });
    }

    const item = await MenuModel.findById(id).populate(
      "restaurantId",
      "ownerId name"
    );

    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    const restaurant = item.restaurantId;
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Parent restaurant no longer exists",
      });
    }

    const userId = req.user._id.toString();
    const ownerId = restaurant.ownerId.toString();

    const isOwner = ownerId === userId;

    // 🔒 admin bypass ONLY if they're scoped to this exact restaurant
    const isScopedAdmin =
      req.user.role === "admin" &&
      req.user.restaurantId &&
      req.user.restaurantId.toString() === restaurant._id.toString();

    if (!isOwner && !isScopedAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "Only the owner or an admin of this restaurant can modify this item",
      });
    }

    req.menuItem = item;
    req.restaurant = restaurant;
    next();
  } catch (err) {
    console.error("requireMenuItemOwnership error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * requireMenuItemRestaurantOwnership (for CREATE)
 * -----------------------------------------------
 * Used on POST /menu-items where there's no `:id` yet.
 * Checks that req.body.restaurantId belongs to req.user (or admin).
 *
 * Also verifies the restaurant exists and is active.
 */
export const requireCreateMenuItemOwnership = async (req, res, next) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication required" });
    }

    const { restaurantId } = req.body;
    if (!restaurantId || !isValidId(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Valid restaurantId is required",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }

    const userId = req.user._id.toString();
    const ownerId = restaurant.ownerId.toString();

    const isOwner = ownerId === userId;

    // 🔒 admin bypass ONLY if they're scoped to this exact restaurant
    const isScopedAdmin =
      req.user.role === "admin" &&
      req.user.restaurantId &&
      req.user.restaurantId.toString() === restaurant._id.toString();

    if (!isOwner && !isScopedAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You can only add menu items to restaurants you own or administer",
      });
    }

    req.restaurant = restaurant;
    next();
  } catch (err) {
    console.error("requireCreateMenuItemOwnership error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};