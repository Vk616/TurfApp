const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking", required: true },
    orderId: { type: String, required: true }, // Razorpay Order ID
    paymentId: { type: String }, // Razorpay Payment ID (after success)
    transactionId: { type: String }, // Transaction reference
    amount: { type: Number, required: true },
    status: { type: String, enum: ["Pending", "Paid", "Failed", "Refunded"], default: "Pending" },
    paymentMethod: { type: String }, // UPI, Card, Net Banking, etc.
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", PaymentSchema);
