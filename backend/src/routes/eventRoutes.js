const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const { createEvent, getAllEvents } = require("../controllers/eventController");

const router = express.Router();

// Public Routes
router.get("/", getAllEvents);

// Admin Only Routes
router.post("/", protect, admin, createEvent);

module.exports = router;
