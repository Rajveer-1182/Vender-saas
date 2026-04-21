import express from "express";
import {
  addInventory,
  getAllInventory,
  getInventoryById,
  getByCategory,
  updateInventory,
  deleteInventory,
  checkAvailability
} from "../controllers/inventory.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Inventory routes
router.post("/add", addInventory);
router.get("/all", getAllInventory);
router.get("/category/:category", getByCategory);
router.get("/:id", getInventoryById);
router.put("/:id", updateInventory);
router.delete("/:id", deleteInventory);
router.post("/check-availability", checkAvailability);

export default router;
