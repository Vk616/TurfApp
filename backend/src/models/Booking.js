const mongoose = require("mongoose")

const BookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: true },
    date: { type: Date, required: true }, // Changed from String to Date
    startTime: { type: Date, required: true }, // Start time as Date object
    endTime: { type: Date, required: true }, // End time as Date object
    timeSlot: { type: String }, // Legacy field for backward compatibility
    status: { type: String, enum: ["confirmed", "cancelled"], default: "confirmed" },
  },
  { timestamps: true },
)

// Add index for faster querying of bookings by date range
BookingSchema.index({ turf: 1, startTime: 1, endTime: 1 })

module.exports = mongoose.model("Booking", BookingSchema)

