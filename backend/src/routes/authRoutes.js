const express = require("express");
const { registerUser, loginUser, logoutUser, createAdminUser, promoteToAdmin } = require("../controllers/authController");
const { protect, admin } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// Admin Routes
router.post("/create-admin", createAdminUser);
router.patch("/promote/:id", protect, admin, promoteToAdmin);

module.exports = router;
