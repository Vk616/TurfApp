const User = require("../models/User");
const Booking = require("../models/Booking");
const Turf = require("../models/Turf");

// Get All Users (Admin Only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Bookings (Admin Only)
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("turf user");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete User (Admin Only)
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllUsers, getAllBookings, deleteUser };
