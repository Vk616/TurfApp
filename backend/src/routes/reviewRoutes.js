const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Review = require("../models/Review");

const router = express.Router();

// Add a Review
router.post("/", protect, async (req, res) => {
  try {
    const { turf, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      turf,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Reviews for a Turf
router.get("/:turfId", async (req, res) => {
  try {
    const reviews = await Review.find({ turf: req.params.turfId }).populate("user", "name");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
