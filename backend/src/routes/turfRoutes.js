const express = require("express");
const { protect, admin, turfOwner } = require("../middleware/authMiddleware"); // Import turfOwner
const upload = require("../middleware/uploadMiddleware");
const { 
  createTurf, 
  getAllTurfs, 
  getTurfById, 
  deleteTurf,
  updateTurfAvailability 
} = require("../controllers/turfController");

const router = express.Router();

// Public Routes
router.get("/", getAllTurfs);
router.get("/:id", getTurfById);

// Admin/Turf Owner Routes
router.post("/", protect, turfOwner, upload.single("image"), createTurf); // Allow turf owners to create
router.put("/:id/availability", protect, turfOwner, updateTurfAvailability); // Use turfOwner middleware

// Admin Only Routes
router.delete("/:id", protect, admin, deleteTurf); // Keep delete admin only for now

module.exports = router;
