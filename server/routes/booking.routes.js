import express from "express";
import {
  createBooking,
  getAllBookings,
  getBookingById,
  getBookingsByMonth,
  updateBookingStatus,
  sendInvoice,
  markDamage,
  updatePayment,
  completeBooking,
  cancelBooking,
  getDashboardAnalytics
} from "../controllers/booking.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// Booking routes
router.post("/create", createBooking);
router.get("/all", getAllBookings);
router.get("/calendar/:month/:year", getBookingsByMonth);
router.get("/analytics/dashboard", getDashboardAnalytics);
router.get("/:id", getBookingById);
router.put("/:id/update-status", updateBookingStatus);
router.put("/:id/update-payment", updatePayment);
router.post("/:id/send-invoice", sendInvoice);
router.post("/:id/mark-damage", markDamage);
router.post("/:id/complete", completeBooking);
router.delete("/:id/cancel", cancelBooking);

export default router;
