const Booking = require("../models/Booking")
const Turf = require("../models/Turf")
const User = require("../models/User")
const { sendBookingConfirmation } = require("../services/emailService")

// Helper function to check for booking conflicts
const checkBookingConflict = async (turfId, startTime, endTime, excludeBookingId = null) => {
  const query = {
    turf: turfId,
    status: "confirmed",
    $or: [
      // Case 1: New booking starts during an existing booking
      { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      // Case 2: New booking contains an existing booking
      { startTime: { $gte: startTime }, endTime: { $lte: endTime } },
      // Case 3: New booking ends during an existing booking
      { startTime: { $lt: startTime }, endTime: { $gt: startTime } },
      // Case 4: New booking starts during an existing booking
      { startTime: { $lt: endTime }, endTime: { $gt: endTime } },
    ],
  }

  // Exclude the current booking when checking for updates
  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId }
  }

  const conflictingBookings = await Booking.find(query)
  return conflictingBookings.length > 0
}

// Create a Booking
const createBooking = async (req, res) => {
  try {
    const { turf: turfId, date, startTime, endTime } = req.body

    // Convert string date to Date object if needed
    const bookingDate = new Date(date)
    
    // Convert string times to Date objects
    const startDateTime = new Date(startTime)
    const endDateTime = new Date(endTime)

    // Validate time range
    if (startDateTime >= endDateTime) {
      return res.status(400).json({ message: "End time must be after start time" })
    }

    // Check for booking conflicts
    const hasConflict = await checkBookingConflict(turfId, startDateTime, endDateTime)
    if (hasConflict) {
      return res.status(409).json({ message: "This time slot is already booked or conflicts with an existing booking" })
    }

    // Create the booking with new time format
    const booking = await Booking.create({
      user: req.user._id,
      turf: turfId,
      date: bookingDate,
      startTime: startDateTime,
      endTime: endDateTime,
      // For backward compatibility
      timeSlot: `${formatTime(startDateTime)} - ${formatTime(endDateTime)}`,
    })

    // Fetch user email & turf details for email
    const user = await User.findById(req.user._id)
    const turf = await Turf.findById(turfId)

    const bookingDetails = {
      turfName: turf.name,
      date: bookingDate.toISOString().split('T')[0],
      timeSlot: booking.timeSlot,
    }

    // Send booking confirmation email
    await sendBookingConfirmation(user.email, bookingDetails)
    res.status(201).json(booking)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message })
  }
}

// Get User Bookings
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("turf")
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Cancel Booking
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
    if (!booking) return res.status(404).json({ message: "Booking not found" })

    // Only allow cancellation if the booking belongs to the user
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" })
    }

    booking.status = "cancelled"
    await booking.save()
    res.json({ message: "Booking canceled successfully" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get booked time slots for a specific turf and date
const getBookedTimeSlots = async (req, res) => {
  try {
    const { turfId, date } = req.query

    if (!turfId || !date) {
      return res.status(400).json({ message: "Turf ID and date are required" })
    }

    // Get the date range for the selected date (start of day to end of day)
    const selectedDate = new Date(date)
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    // Find all bookings for the turf on the selected date
    const bookings = await Booking.find({
      turf: turfId,
      status: "confirmed",
      $or: [
        // Bookings that start on the selected date
        { startTime: { $gte: startOfDay, $lte: endOfDay } },
        // Bookings that end on the selected date
        { endTime: { $gte: startOfDay, $lte: endOfDay } },
        // Bookings that span over the selected date
        { startTime: { $lte: startOfDay }, endTime: { $gte: endOfDay } },
      ],
    })

    // Format the response with booked time slots
    const bookedSlots = bookings.map((booking) => ({
      id: booking._id,
      startTime: booking.startTime,
      endTime: booking.endTime,
      timeSlot: booking.timeSlot,
    }))

    res.json({ bookedSlots })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Helper function to format time for display
const formatTime = (date) => {
  let hours = date.getHours()
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  return `${hours}:00 ${ampm}`
}

// Generate available time slots for a day
const generateTimeSlots = (date) => {
  const slots = []
  const selectedDate = new Date(date)

  // Generate slots from 7 AM to 11 PM
  for (let hour = 7; hour < 24; hour++) {
    const slotStart = new Date(selectedDate)
    slotStart.setHours(hour, 0, 0, 0)

    const slotEnd = new Date(selectedDate)
    slotEnd.setHours(hour + 1, 0, 0, 0)

    slots.push({
      startTime: slotStart,
      endTime: slotEnd,
      displayTime: formatTime(slotStart),
    })
  }

  return slots
}

// Get available time slots for a specific turf and date
const getAvailableTimeSlots = async (req, res) => {
  try {
    const { turfId, date } = req.query

    if (!turfId || !date) {
      return res.status(400).json({ message: "Turf ID and date are required" })
    }

    // Generate all possible time slots for the day
    const allSlots = generateTimeSlots(date)

    // Get booked slots
    const selectedDate = new Date(date)
    const startOfDay = new Date(selectedDate)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(selectedDate)
    endOfDay.setHours(23, 59, 59, 999)

    const bookings = await Booking.find({
      turf: turfId,
      status: "confirmed",
      $or: [
        { startTime: { $gte: startOfDay, $lte: endOfDay } },
        { endTime: { $gte: startOfDay, $lte: endOfDay } },
        { startTime: { $lte: startOfDay }, endTime: { $gte: endOfDay } },
      ],
    })

    // Mark slots as available or booked
    const availableSlots = allSlots.map((slot) => {
      const isBooked = bookings.some(
        (booking) =>
          (slot.startTime >= booking.startTime && slot.startTime < booking.endTime) ||
          (slot.endTime > booking.startTime && slot.endTime <= booking.endTime) ||
          (slot.startTime <= booking.startTime && slot.endTime >= booking.endTime),
      )

      return {
        ...slot,
        isAvailable: !isBooked,
        startTimeISO: slot.startTime.toISOString(),
        endTimeISO: slot.endTime.toISOString(),
      }
    })

    res.json({ availableSlots })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookedTimeSlots,
  getAvailableTimeSlots,
}

