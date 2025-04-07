const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

const router = express.Router();

router.post("/verify-payment", protect, async (req, res) => {
  try {
    const { turfId, date, timeSlot, amount, transactionId, paymentMethod } = req.body;

    // Step 1: Create the booking
    const booking = await Booking.create({
      user: req.user._id,
      turf: turfId,
      date,
      timeSlot,
      status: "confirmed",
    });

    // Step 2: Save the payment info
    const payment = await Payment.create({
      user: req.user._id,
      booking: booking._id,
      orderId: `manual_${Date.now()}`, // Manually generated
      transactionId,
      amount,
      status: "Paid",
      paymentMethod,
    });

    res.status(200).json({
      message: "Payment verified and booking confirmed",
      booking,
      payment,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
