import mongoose from "mongoose";
import bcrypt from "bcryptjs";           // npm i bcryptjs
import User from "../models/userModel.js";

// Helper: validate ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper: strip password from user object
const sanitizeUser = (user) => {
  if (!user) return user;
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  return obj;
};

/* ------------------------------------------------------------------ */
/* CREATE USER                                                         */
/* POST /api/users                                                     */
/* ------------------------------------------------------------------ */
export const createUser = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      phoneNumber,
      role,
    } = req.body;

    // Basic required-field check (Mongoose will also validate)
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

    // Check duplicates (unique index also enforces this)
    const existing = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message:
          existing.email === email.toLowerCase()
            ? "Email already in use"
            : "Username already taken",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: sanitizeUser(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate field value",
        field: Object.keys(err.keyPattern || {}),
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    console.error("createUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ------------------------------------------------------------------ */
/* GET ALL USERS                                                       */
/* GET /api/users                                                      */
/* Supports: ?role=customer&search=john&page=1&limit=10                */
/* ------------------------------------------------------------------ */
export const getAllUsers = async (req, res) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: users.length,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      data: users.map(sanitizeUser),
    });
  } catch (err) {
    console.error("getAllUsers error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ------------------------------------------------------------------ */
/* GET USER BY ID                                                      */
/* GET /api/users/:id                                                  */
/* ------------------------------------------------------------------ */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: sanitizeUser(user),
    });
  } catch (err) {
    console.error("getUserById error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ------------------------------------------------------------------ */
/* UPDATE USER                                                         */
/* PUT /api/users/:id                                                  */
/* ------------------------------------------------------------------ */
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const allowedUpdates = [
      "name",
      "username",
      "email",
      "phoneNumber",
      "role",
      "password", // handled specially below
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

    // Hash password if provided
    if (updates.password) {
      if (updates.password.length < 6) {
        return res.status(400).json({
          success: false,
          message: "Password must be at least 6 characters",
        });
      }
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    // Normalize email
    if (updates.email) updates.email = updates.email.toLowerCase();

    // Check duplicate email/username (excluding this user)
    if (updates.email || updates.username) {
      const or = [];
      if (updates.email) or.push({ email: updates.email });
      if (updates.username) or.push({ username: updates.username });

      const dup = await User.findOne({
        _id: { $ne: id },
        $or: or,
      });
      if (dup) {
        return res.status(409).json({
          success: false,
          message:
            dup.email === updates.email
              ? "Email already in use"
              : "Username already taken",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: sanitizeUser(user),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate field value",
      });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    console.error("updateUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

/* ------------------------------------------------------------------ */
/* DELETE USER                                                         */
/* DELETE /api/users/:id                                               */
/* ------------------------------------------------------------------ */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: { _id: user._id },
    });
  } catch (err) {
    console.error("deleteUser error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


export const updateMyProfile = async (req, res) => {
  try {
    const { name, username, email, phoneNumber } = req.body;

    const updates = {};
    if (name !== undefined) {
      if (!name.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Name cannot be empty" });
      }
      updates.name = name.trim();
    }
    if (username !== undefined) {
      if (!username.trim()) {
        return res
          .status(400)
          .json({ success: false, message: "Username cannot be empty" });
      }
      updates.username = username.trim();
    }
    if (email !== undefined) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid email" });
      }
      updates.email = email.toLowerCase().trim();
    }
    if (phoneNumber !== undefined) {
      updates.phoneNumber = phoneNumber.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No fields to update" });
    }

    // Duplicate check for username/email
    if (updates.username || updates.email) {
      const or = [];
      if (updates.username) or.push({ username: updates.username });
      if (updates.email) or.push({ email: updates.email });

      const dup = await User.findOne({
        _id: { $ne: req.user._id },
        $or: or,
      });
      if (dup) {
        return res.status(409).json({
          success: false,
          message:
            dup.email === updates.email
              ? "Email already in use"
              : "Username already taken",
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    const safe = user.toObject();
    delete safe.password;

    return res.status(200).json({
      success: true,
      message: "Profile updated",
      data: safe,
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ success: false, message: "Duplicate field value" });
    }
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    console.error("updateMyProfile error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* ------------------------------------------------------------------ */
/* CHANGE MY PASSWORD                                                  */
/* PATCH /api/users/me/password                                        */
/* Body: { currentPassword, newPassword }                              */
/* ------------------------------------------------------------------ */
export const changeMyPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "currentPassword and newPassword are required",
      });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
      });
    }
    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current",
      });
    }

    // `password` is select:false → must explicitly fetch
    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) {
      return res
        .status(400)
        .json({ success: false, message: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("changeMyPassword error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* ------------------------------------------------------------------ */
/* LOGIN (bonus)                                                       */
/* POST /api/users/login                                               */
/* ------------------------------------------------------------------ */
// export const loginUser = async (req, res) => {
//   try {
//     const { emailOrUsername, password } = req.body;

//     if (!emailOrUsername || !password) {
//       return res.status(400).json({
//         success: false,
//         message: "emailOrUsername and password are required",
//       });
//     }

//     // password is select:false → must explicitly select it
//     const user = await User.findOne({
//       $or: [
//         { email: emailOrUsername.toLowerCase() },
//         { username: emailOrUsername },
//       ],
//     }).select("+password");

//     if (!user) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({
//         success: false,
//         message: "Invalid credentials",
//       });
//     }

//     // TODO: generate JWT here if you use auth
//     // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

//     return res.status(200).json({
//       success: true,
//       message: "Login successful",
//       // token,
//       data: sanitizeUser(user),
//     });
//   } catch (err) {
//     console.error("loginUser error:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//     });
//   }
// };