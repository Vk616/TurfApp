const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { createBooking, getUserBookings, getBookedTimeSlots, cancelBooking } = require("../controllers/bookingController");

const router = express.Router();

// User Routes
router.post("/", protect, createBooking);
router.get("/", protect, getUserBookings);
router.get("/booked-slots", protect, getBookedTimeSlots); // New route to get booked slots
router.delete("/:id", protect, cancelBooking);

module.exports = router;
