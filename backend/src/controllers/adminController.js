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

// Get All Turfs (Admin Only)
const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find().populate("owner", "name email");
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Booking Status (Admin Only)
const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!["confirmed", "cancelled", "completed"].includes(status)) {
      return res.status(400).json({ message: "Invalid booking status" });
    }
    
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    booking.status = status;
    await booking.save();
    
    res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Booking (Admin Only)
const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    
    await booking.deleteOne();
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Dashboard Statistics (Admin Only)
const getDashboardStats = async (req, res) => {
  try {
    // Get counts from different collections
    const userCount = await User.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const turfCount = await Turf.countDocuments();
    
    // Calculate revenue (sum of all confirmed bookings)
    const bookings = await Booking.find({ status: "confirmed" }).populate("turf");
    let totalRevenue = 0;
    
    for (const booking of bookings) {
      if (booking.turf && booking.turf.pricePerHour) {
        // Calculate hours between start and end time
        const startTime = new Date(booking.startTime);
        const endTime = new Date(booking.endTime);
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        
        totalRevenue += booking.turf.pricePerHour * hours;
      }
    }
    
    // Get recent bookings for activity feed
    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("turf user");
    
    res.json({
      stats: {
        userCount,
        bookingCount,
        turfCount,
        totalRevenue
      },
      recentActivity: recentBookings
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  getAllUsers, 
  getAllBookings, 
  deleteUser,
  getAllTurfs,
  updateBookingStatus,
  deleteBooking,
  getDashboardStats
};
