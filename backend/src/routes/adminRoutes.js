const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { getAllUsers, getAllBookings, deleteUser } = require("../controllers/adminController");

const router = express.Router();

// Admin Routes
router.get("/users", protect, admin, getAllUsers);
router.get("/bookings", protect, admin, getAllBookings);
router.delete("/user/:id", protect, admin, deleteUser);

module.exports = router;
