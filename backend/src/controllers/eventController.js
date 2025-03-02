const Event = require("../models/Event");

// Create an Event
const createEvent = async (req, res) => {
  try {
    const { name, date, time, location, description } = req.body;
    const event = await Event.create({
      name,
      date,
      time,
      location,
      organizer: req.user._id,
      description,
    });

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Events
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(200).json({ message: "No events Found" });
  }
};

module.exports = { createEvent, getAllEvents };
