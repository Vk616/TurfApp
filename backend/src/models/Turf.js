const mongoose = require("mongoose");

const CustomAmenitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  icon: { type: String, default: "star-outline" },
  available: { type: Boolean, default: true }
});

const TurfSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String }, // Main turf image URL
    images: [{ type: String }], // Additional image URLs
    description: { type: String },
    pricePerHour: { type: Number, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Turf owner (Admin)
    availability: [
      {
        start: { type: Date, required: true },
        end: { type: Date, required: true }
      }
    ], // Available time slots as Date objects
    amenities: {
      water: { type: Boolean, default: true },
      parking: { type: Boolean, default: true },
      floodlights: { type: Boolean, default: true },
      changingRoom: { type: Boolean, default: true },
      beverages: { type: Boolean, default: false },
      equipment: { type: Boolean, default: false }
    },
    customAmenities: [CustomAmenitySchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Turf", TurfSchema);