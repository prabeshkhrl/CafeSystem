import express from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
   updateMyProfile,
  changeMyPassword,
} from "../controllers/userController.js";
import {requireAuth} from  '../Middleware/authMiddleware.js'

import { loginUser } from "../controllers/authController.js";

const router = express.Router();

router.patch("/me", requireAuth, updateMyProfile);
router.patch("/me/password", requireAuth, changeMyPassword);

router.post("/", createUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);


// bonus
router.post("/login", loginUser);

export default router;