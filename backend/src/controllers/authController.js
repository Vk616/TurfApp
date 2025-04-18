const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// Helper function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in registerUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists and password matches
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error in loginUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Public
const logoutUser = async (req, res) => {
  try {
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logoutUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an admin user (protected by master key)
// @route   POST /api/auth/create-admin
// @access  Private (requires MASTER_KEY)
const createAdminUser = async (req, res) => {
  try {
    // Verify master key for security
    const { masterKey, name, email, password, phone } = req.body;
    
    if (masterKey !== process.env.MASTER_KEY) {
      return res.status(401).json({ message: "Unauthorized: Invalid master key" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "admin"  // Set role as admin
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "Admin user created successfully"
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in createAdminUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Promote user to admin (Admin only)
// @route   PATCH /api/auth/promote/:id
// @access  Private/Admin
const promoteToAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update user role to admin
    user.role = "admin";
    await user.save();
    
    res.json({ 
      message: "User promoted to admin successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error in promoteToAdmin:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a turf owner user (protected by master key)
// @route   POST /api/auth/create-turf-owner
// @access  Private (requires MASTER_KEY)
const createTurfOwnerUser = async (req, res) => {
  try {
    // Verify master key for security
    const { masterKey, name, email, password, phone } = req.body;
    
    if (masterKey !== process.env.MASTER_KEY) {
      return res.status(401).json({ message: "Unauthorized: Invalid master key" });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Create turf owner user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: "turf_owner"  // Set role as turf_owner
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        message: "Turf owner user created successfully"
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Error in createTurfOwnerUser:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Promote user to turf owner (Admin only)
// @route   PATCH /api/auth/promote-to-turf-owner/:id
// @access  Private/Admin
const promoteToTurfOwner = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Update user role to turf_owner
    user.role = "turf_owner";
    await user.save();
    
    res.json({ 
      message: "User promoted to turf owner successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error("Error in promoteToTurfOwner:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { 
  registerUser, 
  loginUser, 
  logoutUser, 
  createAdminUser, 
  promoteToAdmin, 
  createTurfOwnerUser, 
  promoteToTurfOwner 
};
