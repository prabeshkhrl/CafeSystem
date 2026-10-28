import express from "express";
import {
  listMyAdmins,
  deleteMyAdmin,
} from "../controllers/adminController.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(requireAuth, requireRole("restaurantOwner"));

router.get("/", listMyAdmins);
router.delete("/:id", deleteMyAdmin);

export default router;