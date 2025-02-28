const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createBooking, getUserBookings, cancelBooking } = require("../controllers/bookingController");

const router = express.Router();

// User Routes
router.post("/", protect, createBooking);
router.get("/", protect, getUserBookings);
router.delete("/:id", protect, cancelBooking);

module.exports = router;
