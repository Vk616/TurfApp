const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true }, // Changed from String to Date
    time: { type: String, required: true }, // Keeping as String for time display format
    location: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Registered users
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
