const express = require("express");
const { protect, admin, turfOwner, isTurfOwner } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { 
  createTurf, 
  getAllTurfs, 
  getTurfById, 
  updateTurf,
  deleteTurf,
  updateTurfAvailability 
} = require("../controllers/turfController");

const router = express.Router();

// Public Routes
router.get("/", getAllTurfs);
router.get("/:id", getTurfById);

// Admin/Turf Owner Routes - POST new turf with image
router.post("/", 
  protect, 
  turfOwner,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 }
  ]),
  createTurf
);

// Update turf details with multiple images - protected by isTurfOwner middleware
router.put("/:id", 
  protect, 
  isTurfOwner,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 }
  ]),
  updateTurf
);

// Update turf availability only - protected by isTurfOwner middleware
router.put("/:id/availability", protect, isTurfOwner, updateTurfAvailability);

// Delete turf (Admin or Turf Owner) - protected by isTurfOwner middleware
router.delete("/:id", protect, isTurfOwner, deleteTurf);

module.exports = router;
