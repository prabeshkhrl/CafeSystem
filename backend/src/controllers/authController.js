import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import User from "../Models/userModel.js";
import Restaurant from "../Models/restaurantModel.js";
import { signToken } from "../Utils/jwt.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ================================================================== */
/* 1. REGISTER CUSTOMER                                                */
/* POST /api/auth/register/customer                                    */
/* ================================================================== */
export const registerCustomer = async (req, res) => {
  try {
    const { name, username, email, password, phoneNumber } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, username, email and password are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const exists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (exists) {
      return res.status(409).json({
        success: false,
        message:
          exists.email === email.toLowerCase()
            ? "Email already in use"
            : "Username already taken",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashed,
      phoneNumber,
      role: "customer",           // 🔒 forced
      restaurantId: null,         // 🔒 forced
    });

    const token = signToken({ id: user._id.toString(), role: user.role });

    return res.status(201).json({
      success: true,
      message: "Customer registered successfully",
      token,
      data: sanitize(user),
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* 2. REGISTER RESTAURANT OWNER (self-signup + creates restaurant)     */
/* POST /api/auth/register/restaurant                                  */
/* Body: user fields + restaurant fields                               */
/* ================================================================== */
export const registerRestaurantOwner = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const {
      // user
      name,
      username,
      email,
      password,
      phoneNumber,
      // restaurant
      restaurantName,
      about,
      address,
      restaurantPhoneNumber,
      restaurantLogo,
      restaurantBanner,
      paymentMethods,
    } = req.body;

    if (
      !name ||
      !username ||
      !email ||
      !password ||
      !restaurantName ||
      !address ||
      !restaurantPhoneNumber
    ) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message:
          "name, username, email, password, restaurantName, address, restaurantPhoneNumber are required",
      });
    }
    if (password.length < 6) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const exists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    }).session(session);
    if (exists) {
      await session.abortTransaction();
      return res.status(409).json({
        success: false,
        message:
          exists.email === email.toLowerCase()
            ? "Email already in use"
            : "Username already taken",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    // 1. Create user (role forced to restaurantOwner)
    const [user] = await User.create(
      [
        {
          name,
          username,
          email,
          password: hashed,
          phoneNumber,
          role: "restaurantOwner", // 🔒 forced
          restaurantId: null,      // set after restaurant is created
        },
      ],
      { session }
    );

    // 2. Create restaurant owned by this user
    const [restaurant] = await Restaurant.create(
      [
        {
          name: restaurantName,
          about,
          ownerId: user._id,
          restaurantLogo,
          restaurantBanner,
          address,
          phoneNumber: restaurantPhoneNumber,
          paymentMethods,
        },
      ],
      { session }
    );

    // 3. Link user → restaurant
    user.restaurantId = restaurant._id;
    await user.save({ session });

    await session.commitTransaction();

    const token = signToken({ id: user._id.toString(), role: user.role });

    return res.status(201).json({
      success: true,
      message: "Restaurant owner registered successfully",
      token,
      data: {
        user: sanitize(user),
        restaurant,
      },
    });
  } catch (err) {
    await session.abortTransaction();
    return handleError(err, res);
  } finally {
    session.endSession();
  }
};

/* ================================================================== */
/* 3. REGISTER ADMIN (only restaurantOwner can do this)                */
/* POST /api/auth/register/admin                                       */
/* Requires: requireAuth + requireRole("restaurantOwner")              */
/* ================================================================== */
export const registerAdmin = async (req, res) => {
  try {
    const { name, username, email, password, phoneNumber } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, username, email and password are required",
      });
    }
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // 🔒 Only a restaurantOwner with a linked restaurant may register admins
    if (req.user.role !== "restaurantOwner") {
      return res.status(403).json({
        success: false,
        message: "Only a restaurant owner can register restaurant admins",
      });
    }
    if (!req.user.restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Owner has no linked restaurant",
      });
    }

    // Optional: limit admins per restaurant
    // const adminCount = await User.countDocuments({
    //   role: "admin",
    //   restaurantId: req.user.restaurantId,
    // });
    // if (adminCount >= 10) {
    //   return res.status(409).json({
    //     success: false,
    //     message: "Admin limit reached for this restaurant",
    //   });
    // }

    const exists = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (exists) {
      return res.status(409).json({
        success: false,
        message:
          exists.email === email.toLowerCase()
            ? "Email already in use"
            : "Username already taken",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      username,
      email,
      password: hashed,
      phoneNumber,
      role: "admin",                     // 🔒 forced
      restaurantId: req.user.restaurantId, // 🔒 scoped to owner's restaurant
    });

    return res.status(201).json({
      success: true,
      message: "Restaurant admin registered successfully",
      data: sanitize(admin),
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ================================================================== */
/* LOGIN (unchanged, works for all roles)                              */
/* ================================================================== */
export const loginUser = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;
    if (!emailOrUsername || !password) {
      return res.status(400).json({
        success: false,
        message: "emailOrUsername and password are required",
      });
    }

    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername },
      ],
    }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = signToken({ id: user._id.toString(), role: user.role });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: sanitize(user),
    });
  } catch (err) {
    return handleError(err, res);
  }
};

/* ---------- helpers ---------- */
function sanitize(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
}

function handleError(err, res) {
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
  return res
    .status(500)
    .json({ success: false, message: "Internal server error" });
}