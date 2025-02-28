const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { createTurf, getAllTurfs, getTurfById, deleteTurf } = require("../controllers/turfController");

const router = express.Router();

// Public Routes
router.get("/", getAllTurfs);
router.get("/:id", getTurfById);

// Admin Only Routes
router.post("/", protect, admin, upload.single("image"), createTurf);
router.delete("/:id", protect, admin, deleteTurf);

module.exports = router;
