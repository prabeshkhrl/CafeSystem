import mongoose from "mongoose";
import User from "../models/userModel.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/* ------------------------------------------------------------------ */
/* LIST ADMINS FOR MY RESTAURANT                                       */
/* GET /api/admins                                                     */
/* Only restaurantOwner can call this.                                 */
/* ------------------------------------------------------------------ */
export const listMyAdmins = async (req, res) => {
  try {
    if (req.user.role !== "restaurantOwner") {
      return res.status(403).json({
        success: false,
        message: "Only restaurant owners can view admins",
      });
    }
    if (!req.user.restaurantId) {
      return res.status(400).json({
        success: false,
        message: "No restaurant linked to your account",
      });
    }

    const admins = await User.find({
      role: "admin",
      restaurantId: req.user.restaurantId,
    })
      .select("name username email phoneNumber createdAt")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: admins.length,
      data: admins,
    });
  } catch (err) {
    console.error("listMyAdmins error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ------------------------------------------------------------------ */
/* DELETE ADMIN                                                        */
/* DELETE /api/admins/:id                                              */
/* Only the owning restaurantOwner can delete.                         */
/* ------------------------------------------------------------------ */
export const deleteMyAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid admin ID" });
    }

    if (req.user.role !== "restaurantOwner") {
      return res.status(403).json({
        success: false,
        message: "Only restaurant owners can remove admins",
      });
    }

    const admin = await User.findById(id);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    // must be an admin of THIS owner's restaurant
    if (
      admin.role !== "admin" ||
      !admin.restaurantId ||
      admin.restaurantId.toString() !== req.user.restaurantId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You can only remove admins from your own restaurant",
      });
    }

    // Prevent self-deletion (owner is not an admin, but defensive)
    if (admin._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: "You cannot remove yourself",
      });
    }

    await admin.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Admin removed",
      data: { _id: admin._id },
    });
  } catch (err) {
    console.error("deleteMyAdmin error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};