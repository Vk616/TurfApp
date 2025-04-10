const mongoose = require("mongoose");

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String }, // URL of the turf image
    description: { type: String },
    pricePerHour: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Turf owner (Admin)
    availability: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
      }
    ], // Available time slots as Date objects
  },
  { timestamps: true }
);

module.exports = mongoose.model("Turf", TurfSchema);