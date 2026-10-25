import mongoose from "mongoose";
import Restaurant from "../Models/restaurantModel.js";
import User from "../Models/userModel.js";

// ---------- helpers ----------
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleValidationError = (err, res) => {
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
      message: "Duplicate field value",
      field: Object.keys(err.keyPattern || {}),
    });
  }
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

/* ------------------------------------------------------------------ */
/* CREATE RESTAURANT                                                   */
/* POST /api/restaurants                                               */
/* ------------------------------------------------------------------ */
export const createRestaurant = async (req, res) => {
  try {
    const {
      name,
      about,
      
      restaurantLogo,
      restaurantBanner,
      address,
      phoneNumber,
      paymentMethods,
      isActive,
    } = req.body;

     // 🔒 Ignore any client-supplied ownerId — use the authenticated user
     const ownerId = req.user._id;

    if (!name || !ownerId || !address || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "name, ownerId, address and phoneNumber are required",
      });
    }

    if (!isValidId(ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ownerId",
      });
    }

    // Ensure the owner exists
    const owner = await User.findById(ownerId);
    if (!owner) {
      return res.status(404).json({
        success: false,
        message: "Owner (User) not found",
      });
    }

    // Optional: prevent the same owner from spamming restaurants
    // (remove if one owner can have multiple restaurants)
    // const existing = await Restaurant.findOne({ ownerId });
    // if (existing) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "This owner already has a restaurant",
    //   });
    // }

    const restaurant = await Restaurant.create({
      name,
      about,
      ownerId,
      restaurantLogo,
      restaurantBanner,
      address,
      phoneNumber,
      paymentMethods,
      isActive,
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      data: restaurant,
    });
  } catch (err) {
    return handleValidationError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* GET ALL RESTAURANTS                                                 */
/* GET /api/restaurants                                                */
/* Filters: ?ownerId=&isActive=&search=&paymentMethod=&page=&limit=    */
/* ------------------------------------------------------------------ */
export const getAllRestaurants = async (req, res) => {
  try {
    const {
      ownerId,
      isActive,
      search,
      paymentMethod,
      page = 1,
      limit = 10,
    } = req.query;

    const filter = {};

    if (ownerId) {
      if (!isValidId(ownerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ownerId",
        });
      }
      filter.ownerId = ownerId;
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (paymentMethod) {
      filter.paymentMethods = { $in: [paymentMethod] };
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
        { about: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter)
        .populate("ownerId", "name username email phoneNumber")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Restaurant.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: restaurants,
    });
  } catch (err) {
    return handleValidationError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* GET RESTAURANT BY ID                                                */
/* GET /api/restaurants/:id                                            */
/* ------------------------------------------------------------------ */
export const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findById(id).populate(
      "ownerId",
      "name username email phoneNumber role"
    );

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: restaurant,
    });
  } catch (err) {
    return handleValidationError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* GET RESTAURANTS BY OWNER                                            */
/* GET /api/restaurants/owner/:ownerId                                 */
/* ------------------------------------------------------------------ */
export const getRestaurantsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;

    if (!isValidId(ownerId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ownerId",
      });
    }

    const restaurants = await Restaurant.find({ ownerId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants,
    });
  } catch (err) {
    return handleValidationError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* UPDATE RESTAURANT                                                   */
/* PUT /api/restaurants/:id                                            */
/* ------------------------------------------------------------------ */
export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const allowedUpdates = [
      "name",
      "about",
      "ownerId",
      "restaurantLogo",
      "restaurantBanner",
      "address",
      "phoneNumber",
      "paymentMethods",
      "isActive",
    ];

    const updates = {};
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields to update",
      });
    }

    // If ownerId is being changed, validate + ensure exists
    if (updates.ownerId) {
      if (!isValidId(updates.ownerId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid ownerId",
        });
      }
      const owner = await User.findById(updates.ownerId);
      if (!owner) {
        return res.status(404).json({
          success: false,
          message: "Owner (User) not found",
        });
      }
    }

    const restaurant = await Restaurant.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    ).populate("ownerId", "name username email");

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      data: restaurant,
    });
  } catch (err) {
    return handleValidationError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* TOGGLE ACTIVE STATUS                                                */
/* PATCH /api/restaurants/:id/toggle-active                            */
/* ------------------------------------------------------------------ */
export const toggleRestaurantActive = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    restaurant.isActive = !restaurant.isActive;
    await restaurant.save();

    return res.status(200).json({
      success: true,
      message: `Restaurant is now ${restaurant.isActive ? "active" : "inactive"}`,
      data: restaurant,
    });
  } catch (err) {
    return handleValidationError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* DELETE RESTAURANT                                                   */
/* DELETE /api/restaurants/:id                                         */
/* ------------------------------------------------------------------ */
export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurant ID",
      });
    }

    const restaurant = await Restaurant.findByIdAndDelete(id);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }
    

    return res.status(200).json({
      success: true,
      message: "Restaurant deleted successfully",
      data: { _id: restaurant._id },
    });
  } catch (err) {
    return handleValidationError(err, res);
  }
};