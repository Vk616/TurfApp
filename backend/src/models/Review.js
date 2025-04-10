const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    turf: { type: mongoose.Schema.Types.ObjectId, ref: "Turf", required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
