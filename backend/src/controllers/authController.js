const User = require("../models/User");
const { generateToken } = require("../config/authConfig");

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || "user" // 👈 Ensures role is set correctly, defaults to "user"
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role, // 👈 Include role in response
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login User
const loginUser = async (req, res) => {
  try {
    console.log("🟢 Login request received:", req.body.email);

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid email or password" });
    }

    console.log("🔑 Checking password for:", user.email);

    if (!user.matchPassword) {
      console.error("❌ matchPassword method missing in User model");
      return res.status(500).json({ message: "Internal server error" });
    }

    const isMatch = await user.matchPassword(password);
    console.log("Password Match:", isMatch);

    if (isMatch) {
      console.log("✅ Login successful for:", user.email);
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      console.log("❌ Incorrect password for:", user.email);
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.error("🚨 Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Logout User
const logoutUser = (req, res) => {
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
