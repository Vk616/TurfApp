const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { 
  getAllUsers, 
  getAllBookings, 
  deleteUser, 
  getAllTurfs,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats 
} = require("../controllers/adminController");

const router = express.Router();

// Admin Routes
router.get("/users", protect, admin, getAllUsers);
router.get("/bookings", protect, admin, getAllBookings);
router.delete("/user/:id", protect, admin, deleteUser);

// New Admin Routes
router.get("/turfs", protect, admin, getAllTurfs);
router.get("/dashboard-stats", protect, admin, getDashboardStats);
router.patch("/booking/:id", protect, admin, updateBookingStatus);
router.delete("/booking/:id", protect, admin, deleteBooking);

module.exports = router;
