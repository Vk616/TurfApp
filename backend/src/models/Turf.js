const mongoose = require("mongoose");

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String }, // URL of the turf image
    description: { type: String },
    pricePerHour: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Turf owner (Admin)
    availability: { type: [String], default: [] }, // Available time slots
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Turf", TurfSchema);