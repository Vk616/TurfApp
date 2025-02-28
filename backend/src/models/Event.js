const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    date: { type: String, required: true }, // YYYY-MM-DD
    time: { type: String, required: true }, // e.g., "5:00 PM"
    location: { type: String, required: true },
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Registered users
    description: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
