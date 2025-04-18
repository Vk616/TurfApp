const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Turf = require("../models/Turf");

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Get token from header
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password"); // Attach user to request
      next();
    } catch (error) {
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin" });
  }
};

const turfOwner = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "turf_owner")) {
    next();
  } else {
    res.status(403).json({ message: "Not authorized as an admin or turf owner" });
  }
};

// Middleware to check if a user is the owner of a specific turf
const isTurfOwner = async (req, res, next) => {
  try {
    const turfId = req.params.id;
    
    // Skip check for admins (they can edit any turf)
    if (req.user && req.user.role === "admin") {
      return next();
    }
    
    // For turf owners, check if they own this specific turf
    if (req.user) {
      const turf = await Turf.findById(turfId);
      
      if (!turf) {
        return res.status(404).json({ message: "Turf not found" });
      }
      
      if (turf.owner.toString() === req.user._id.toString()) {
        return next();
      }
    }
    
    res.status(403).json({ message: "Not authorized to modify this turf" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { protect, admin, turfOwner, isTurfOwner };
