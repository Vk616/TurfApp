const express = require("express")
const { protect } = require("../middleware/authMiddleware")
const {
  createBooking,
  getUserBookings,
  getBookedTimeSlots,
  cancelBooking,
  getAvailableTimeSlots,
} = require("../controllers/bookingController")

const router = express.Router()

// User Routes
router.post("/", protect, createBooking)
router.get("/", protect, getUserBookings)
router.get("/booked-slots", protect, getBookedTimeSlots)
router.get("/available-slots", protect, getAvailableTimeSlots)
router.delete("/:id", protect, cancelBooking)

module.exports = router

