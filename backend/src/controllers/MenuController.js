import mongoose from "mongoose";
import MenuModel from "../Models/menuModel.js";
import Restaurant from "../Models/restaurantModel.js";
import { deleteCloudinaryImage } from "../lib/cloudinary.js";

// ---------- helpers ----------
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
      message: "Duplicate field value",
      field: Object.keys(err.keyPattern || {}),
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid value for ${err.path}`,
    });
  }
  console.error(err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

/* ------------------------------------------------------------------ */
/* CREATE MENU ITEM                                                    */
/* POST /api/menu-items                                                */
/* ------------------------------------------------------------------ */
export const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      description,
      restaurantId,
      menuItemImage,
      isAvailable,
    } = req.body;

    // if (
    //   name === undefined ||
    //   price === undefined ||
    //   !category ||
    //   !restaurantId
    // ) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "name, price, category and restaurantId are required",
    //   });
    // }

    // if (!isValidId(restaurantId)) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Invalid restaurantId — must be a 24-character MongoDB ObjectId",
    //   });
    // }

    // // Ensure the restaurant exists
    // const restaurant = await Restaurant.findById(restaurantId);
    // if (!restaurant) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Restaurant not found",
    //   });
    // }

    const item = await MenuModel.create({
      name,
      price,
      category,
      description,
      restaurantId,
      menuItemImage,
      isAvailable,
    });

    return res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: item,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* GET ALL MENU ITEMS                                                  */
/* GET /api/menu-items                                                 */
/* Filters: ?restaurantId=&category=&isAvailable=&search=&minPrice=    */
/*          &maxPrice=&page=&limit=                                     */
/* ------------------------------------------------------------------ */
export const getAllMenuItems = async (req, res) => {
  try {
    const {
      restaurantId,
      category,
      isAvailable,
      search,
      minPrice,
      maxPrice,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    if (restaurantId) {
      if (!isValidId(restaurantId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid restaurantId",
        });
      }
      filter.restaurantId = restaurantId;
    }

    if (category) filter.category = category;

    if (isAvailable !== undefined) {
      filter.isAvailable = isAvailable === "true";
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      filter.price = {};
      if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
      if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [items, total] = await Promise.all([
      MenuModel.find(filter)
        .populate("restaurantId", "name address phoneNumber isActive")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      MenuModel.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: items.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: items,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* GET MENU ITEMS BY RESTAURANT                                        */
/* GET /api/menu-items/restaurant/:restaurantId                        */
/* ------------------------------------------------------------------ */
export const getMenuItemsByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    if (!isValidId(restaurantId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid restaurantId",
      });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    const items = await MenuModel.find({ restaurantId }).sort({
      category: 1,
      name: 1,
    });

    return res.status(200).json({
      success: true,
      count: items.length,
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        isActive: restaurant.isActive,
      },
      data: items,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* GET MENU ITEM BY ID                                                 */
/* GET /api/menu-items/:id                                             */
/* ------------------------------------------------------------------ */
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const item = await MenuModel.findById(id).populate(
      "restaurantId",
      "name address phoneNumber isActive"
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: item,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* UPDATE MENU ITEM                                                    */
/* PUT /api/menu-items/:id                                             */
/* ------------------------------------------------------------------ */
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid menu item ID" });
    }

    const item = await MenuModel.findById(id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    // ownership check … (already in your middleware)

    const previousImage = item.menuItemImage;

    const allowedUpdates = [
      "name",
      "price",
      "category",
      "description",
      "menuItemImage",
      "isAvailable",
    ];
    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) item[key] = req.body[key];
    }

    await item.save();

    // 🔥 If the image changed, delete the old one
    if (
      previousImage &&
      item.menuItemImage &&
      previousImage !== item.menuItemImage
    ) {
      await deleteCloudinaryImage(previousImage);
    }

    return res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: item,
    });
  } catch (err) {
    console.error("updateMenuItem error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* ------------------------------------------------------------------ */
/* TOGGLE AVAILABILITY                                                 */
/* PATCH /api/menu-items/:id/toggle-availability                       */
/* ------------------------------------------------------------------ */
export const toggleMenuItemAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid menu item ID",
      });
    }

    const item = await MenuModel.findById(id);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    return res.status(200).json({
      success: true,
      message: `Menu item is now ${
        item.isAvailable ? "available" : "unavailable"
      }`,
      data: item,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ------------------------------------------------------------------ */
/* DELETE MENU ITEM                                                    */
/* DELETE /api/menu-items/:id                                          */
/* ------------------------------------------------------------------ */
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid menu item ID" });
    }

    const item = await MenuModel.findById(id);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Menu item not found" });
    }

    // 🔥 Clean up Cloudinary
    if (item.menuItemImage) {
      await deleteCloudinaryImage(item.menuItemImage);
    }

    await item.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Menu item deleted",
      data: { _id: item._id },
    });
  } catch (err) {
    console.error("deleteMenuItem error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};