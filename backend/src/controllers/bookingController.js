const Booking = require("../models/Booking");

// Create a Booking
const createBooking = async (req, res) => {
  try {
    const { turf, date, timeSlot } = req.body;
    const booking = await Booking.create({
      user: req.user._id,
      turf,
      date,
      timeSlot,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("turf");
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    await booking.deleteOne();
    res.json({ message: "Booking canceled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getBookedTimeSlots = async (req, res) => {
  try {
    const { turfId, date } = req.query;

    if (!turfId || !date) {
      return res.status(400).json({ message: "Turf ID and date are required" });
    }

    const bookings = await Booking.find({ turf: turfId, date });

    // Extract booked time slots from stored time ranges
    const bookedSlots = new Set();

    bookings.forEach((booking) => {
      const timeRange = booking.timeSlot;
      
      if (timeRange.includes(" - ")) {
        const [start, end] = timeRange.split(" - ");
        const allSlots = generateTimeSlots();
        const startIndex = allSlots.indexOf(start.trim());
        const endIndex = allSlots.indexOf(end.trim());

        if (startIndex !== -1 && endIndex !== -1) {
          for (let i = startIndex; i <= endIndex; i++) {
            bookedSlots.add(allSlots[i]);
          }
        }
      } else {
        bookedSlots.add(timeRange.trim());
      }
    });

    res.json({ bookedSlots: Array.from(bookedSlots) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Function to generate time slots (same as frontend)
const generateTimeSlots = () => {
  const slots = [];
  let hour = 7;
  while (hour < 24) {
    let formattedHour = hour > 12 ? hour - 12 : hour;
    let ampm = hour >= 12 ? "PM" : "AM";
    slots.push(`${formattedHour}:00 ${ampm}`);
    hour++;
  }
  return slots;
};

module.exports = { createBooking, getUserBookings, cancelBooking ,getBookedTimeSlots};
