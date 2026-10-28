import User from "../models/userModel.js";
import { verifyToken } from "../utils/jwt.js";

/**
 * requireAuth
 * -----------
 * Verifies the JWT from the Authorization header and attaches
 * `req.user` (a Mongo document from `users` collection).
 *
 * Expects header:  Authorization: Bearer <token>
 *
 * On success:
 *   req.user = { _id, name, username, email, role, ... }   (no password)
 *
 * On failure:
 *   401 — missing, malformed, expired, or invalid token
 *   401 — user no longer exists in DB
 *   403 — user account disabled (if you have such a field)
 */
export const requireAuth = async (req, res, next) => {
  try {
    const header = req.headers.authorization || req.headers.Authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required: missing Bearer token",
      });
    }

    const token = header.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required: empty token",
      });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (err) {
      const msg =
        err.name === "TokenExpiredError"
          ? "Token expired"
          : "Invalid token";
      return res.status(401).json({ success: false, message: msg });
    }

    // Token payload should contain `id` (user _id) — adjust if yours uses `_id`
    const userId = decoded.id || decoded._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // Optional: block disabled users
    // if (user.isDisabled) {
    //   return res.status(403).json({ success: false, message: "Account disabled" });
    // }

    req.user = user;
    next();
  } catch (err) {
    console.error("requireAuth error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/**
 * requireRole("admin", "restaurantOwner", ...)
 * --------------------------------------------
 * Must be used *after* requireAuth.
 * Rejects with 403 if req.user.role is not in the allowed list.
 */
export const requireRole =
  (...roles) =>
  (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied: requires role ${roles.join(" or ")}`,
      });
    }
    next();
  };

/**
 * requireAdmin
 * ------------
 * Shorthand for requireRole("admin").
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Authentication required" });
  }
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
};