import mongoose from "mongoose";
import Order from "../models/orderModel.js";
import MenuModel from "../models/menuModel.js";
import Restaurant from "../models/restaurantModel.js";

// ---------- helpers ----------
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const round2 = (n) => Math.round(n * 100) / 100;

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
  return res.status(500).json({ success: false, message: "Internal server error" });
};

/** Valid status transitions */
const ALLOWED_TRANSITIONS = {
  placed: ["confirmed", "cancelled", "rejected"],
  confirmed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["out_for_delivery", "cancelled"],
  out_for_delivery: ["delivered", "cancelled"],
  delivered: [],   // terminal
  cancelled: [],   // terminal
  rejected: [],    // terminal
};

const TERMINAL_STATUSES = ["delivered", "cancelled", "rejected"];

/**
 * Can this user change the order's status?
 *  - customer can: cancel (placed/confirmed/preparing/ready/out_for_delivery)
 *  - owner/scoped-admin of the restaurant can: everything except cancel-as-customer
 *  - admin scoped to this restaurant can also do all owner actions
 */
const canChangeStatus = (user, order, nextStatus) => {
  const userId = user._id.toString();

  const isCustomer = order.customerId.toString() === userId;
  const isOwner = false; // we'll populate restaurant before calling
  const isScopedAdmin =
    user.role === "admin" &&
    user.restaurantId &&
    user.restaurantId.toString() === order.restaurantId.toString();

  // customer cancels
  if (isCustomer && nextStatus === "cancelled") {
    return ["placed", "confirmed", "preparing", "ready", "out_for_delivery"].includes(
      order.status
    );
  }

  // owner of the restaurant
  const restaurant = order.__restaurant; // attached by caller
  if (restaurant && restaurant.ownerId.toString() === userId) {
    return !TERMINAL_STATUSES.includes(order.status);
  }

  // scoped admin
  if (isScopedAdmin) {
    return !TERMINAL_STATUSES.includes(order.status);
  }

  return false;
};

/* ================================================================== */
/* CREATE ORDER                                                        */
/* POST /api/orders                                                    */
/* Body: { restaurantId, items:[{menuItemId, quantity, specialInstructions}], */
/*         paymentMethod, deliveryAddress, deliveryPhone, deliveryNotes }    */
/* ================================================================== */
export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      restaurantId,
      items,
      paymentMethod,
      deliveryAddress,
      deliveryPhone,
      deliveryNotes,
      deliveryFee,
      tax,
      discount,
    } = req.body;

    // ---------- validate inputs ----------
    if (!restaurantId || !isValidId(restaurantId)) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Valid restaurantId is required" });
    }
    if (!Array.isArray(items) || items.length === 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "At least one item is required" });
    }
    if (!paymentMethod || !deliveryAddress || !deliveryPhone) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "paymentMethod, deliveryAddress and deliveryPhone are required",
      });
    }

    // ---------- fetch restaurant ----------
    const restaurant = await Restaurant.findById(restaurantId).session(session);
    if (!restaurant) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ success: false, message: "Restaurant not found" });
    }
    if (!restaurant.isActive) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Restaurant is currently inactive" });
    }

    // ---------- validate + recompute line items from DB ----------
    const validatedItems = [];
    let subtotal = 0;

    for (const raw of items) {
      if (!raw.menuItemId || !isValidId(raw.menuItemId)) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `Invalid menuItemId: ${raw.menuItemId}`,
        });
      }
      const quantity = parseInt(raw.quantity, 10);
      if (!Number.isInteger(quantity) || quantity < 1) {
        await session.abortTransaction();
        return res
          .status(400)
          .json({ success: false, message: "quantity must be >= 1" });
      }

      const menuItem = await MenuModel.findOne({
        _id: raw.menuItemId,
        restaurantId, // 🛡️ prevents mixing restaurants
      }).session(session);

      if (!menuItem) {
        await session.abortTransaction();
        return res.status(404).json({
          success: false,
          message: `Menu item not found in this restaurant: ${raw.menuItemId}`,
        });
      }
      if (!menuItem.isAvailable) {
        await session.abortTransaction();
        return res.status(400).json({
          success: false,
          message: `"${menuItem.name}" is currently unavailable`,
        });
      }

      // ⚠️ NEVER trust client price — use DB price
      const lineTotal = round2(menuItem.price * quantity);
      subtotal = round2(subtotal + lineTotal);

      validatedItems.push({
        menuItemId: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        image: menuItem.menuItemImage || "",
        specialInstructions: raw.specialInstructions || "",
        lineTotal,
      });
    }

    // ---------- server-side totals ----------
    const dfee = Math.max(0, Number(deliveryFee) || 0);
    const tx = Math.max(0, Number(tax) || 0);
    const disc = Math.max(0, Number(discount) || 0);
    const total = round2(subtotal + dfee + tx - disc);

    if (total < 0) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ success: false, message: "Discount cannot exceed order value" });
    }

    // ---------- create ----------
    const [order] = await Order.create(
      [
        {
          customerId: req.user._id,
          restaurantId,
          items: validatedItems,
          subtotal,
          deliveryFee: dfee,
          tax: tx,
          discount: disc,
          total,
          paymentMethod,
          deliveryAddress,
          deliveryPhone,
          deliveryNotes: deliveryNotes || "",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (err) {
    await session.abortTransaction();
    return handleError(err, res);
  } finally {
    session.endSession();
  }
};

/* ================================================================== */
/* GET MY ORDERS (as customer)                                         */
/* GET /api/orders/my?status=placed&page=1&limit=10                    */
/* ================================================================== */
export const getMyOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const filter = { customerId: req.user._id };
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("restaurantId", "name address phoneNumber restaurantLogo")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* GET RESTAURANT ORDERS (owner or scoped admin)                       */
/* GET /api/orders/restaurant/:restaurantId?status=&page=&limit=       */
/* ================================================================== */
export const getRestaurantOrders = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    if (!isValidId(restaurantId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid restaurantId" });
    }

    const filter = { restaurantId };
    if (status) filter.status = status;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate("customerId", "name phoneNumber email")
        .populate("restaurantId", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Order.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: orders.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: orders,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* GET ORDER BY ID                                                     */
/* GET /api/orders/:id                                                 */
/* Visible to: the customer who placed it, the restaurant's owner,    */
/*             scoped admin of that restaurant, or admin.             */
/* ================================================================== */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id)
      .populate("customerId", "name phoneNumber email")
      .populate("restaurantId", "name address phoneNumber ownerId")
      .populate("reviewId", "_id rating comment createdAt images"); ;

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    const userId = req.user._id.toString();
    const isCustomer = order.customerId._id.toString() === userId;
    const isOwner =
      order.restaurantId.ownerId &&
      order.restaurantId.ownerId.toString() === userId;
    const isScopedAdmin =
      req.user.role === "admin" &&
      req.user.restaurantId &&
      req.user.restaurantId.toString() === order.restaurantId._id.toString();

    if (!isCustomer && !isOwner && !isScopedAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "You cannot view this order" });
    }

    return res.status(200).json({ success: true, data: order });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* UPDATE ORDER STATUS                                                 */
/* PATCH /api/orders/:id/status                                        */
/* Body: { status, note? }                                             */
/* ================================================================== */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: nextStatus, note = "" } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // validate transition
    const allowed = ALLOWED_TRANSITIONS[order.status] || [];
    if (!allowed.includes(nextStatus)) {
      return res.status(400).json({
        success: false,
        message: `Cannot transition from "${order.status}" to "${nextStatus}"`,
        allowedTransitions: allowed,
      });
    }

    // attach restaurant to check owner/scoped admin
    const restaurant = await Restaurant.findById(order.restaurantId);
    order.__restaurant = restaurant;

    if (!canChangeStatus(req.user, order, nextStatus)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to perform this status change",
      });
    }

    // apply
    order.status = nextStatus;
    order.statusHistory.push({
      status: nextStatus,
      changedBy: req.user._id,
      note,
    });

    if (nextStatus === "delivered") order.deliveredAt = new Date();
    if (nextStatus === "cancelled" || nextStatus === "rejected") {
      order.cancelledBy = req.user._id;
      order.cancelReason = note || "";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: `Order status updated to "${nextStatus}"`,
      data: order,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* CANCEL ORDER (customer-only convenience endpoint)                   */
/* PATCH /api/orders/:id/cancel                                        */
/* Body: { reason? }                                                   */
/* ================================================================== */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason = "" } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.customerId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "You can only cancel your own order" });
    }

    const allowed = ["placed", "confirmed"];
    if (!allowed.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in status "${order.status}"`,
      });
    }

    order.status = "cancelled";
    order.cancelledBy = req.user._id;
    order.cancelReason = reason;
    order.statusHistory.push({
      status: "cancelled",
      changedBy: req.user._id,
      note: reason,
    });

    // refund if already paid
    if (order.paymentStatus === "paid") {
      order.paymentStatus = "refunded";
    }

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* UPDATE PAYMENT STATUS (owner/admin only)                            */
/* PATCH /api/orders/:id/payment                                       */
/* Body: { paymentStatus: "paid"|"failed"|"refunded" }                 */
/* ================================================================== */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    if (!["paid", "failed", "refunded"].includes(paymentStatus)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid paymentStatus" });
    }

    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // only owner/scoped admin of this restaurant
    const restaurant = await Restaurant.findById(order.restaurantId);
    const userId = req.user._id.toString();
    const isOwner = restaurant && restaurant.ownerId.toString() === userId;
    const isScopedAdmin =
      req.user.role === "admin" &&
      req.user.restaurantId &&
      req.user.restaurantId.toString() === order.restaurantId.toString();

    if (!isOwner && !isScopedAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not allowed to update payment" });
    }

    order.paymentStatus = paymentStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: `Payment status set to "${paymentStatus}"`,
      data: order,
    });
  } catch (err) {
    return handleError(err, res);
  }
};