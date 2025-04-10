const Turf = require("../models/Turf");

// Validate availability slots
const validateAvailabilitySlots = (slots) => {
  if (!Array.isArray(slots)) {
    return { valid: false, message: "Availability must be an array" };
  }
  
  // Check if each slot has valid start and end dates
  for (const slot of slots) {
    if (!slot.start || !slot.end) {
      return { valid: false, message: "Each slot must have start and end times" };
    }
    
    const startTime = new Date(slot.start);
    const endTime = new Date(slot.end);
    
    if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
      return { valid: false, message: "Invalid date format" };
    }
    
    if (startTime >= endTime) {
      return { valid: false, message: "Start time must be before end time" };
    }
  }
  
  // Check for overlapping slots
  for (let i = 0; i < slots.length; i++) {
    const slotA = slots[i];
    const startTimeA = new Date(slotA.start);
    const endTimeA = new Date(slotA.end);
    
    for (let j = i + 1; j < slots.length; j++) {
      const slotB = slots[j];
      const startTimeB = new Date(slotB.start);
      const endTimeB = new Date(slotB.end);
      
      // Check if slots overlap
      if ((startTimeA < endTimeB && endTimeA > startTimeB)) {
        return { valid: false, message: "Time slots cannot overlap" };
      }
    }
  }
  
  return { valid: true };
};

// Create Turf (Admin Only)
const createTurf = async (req, res) => {
  try {
    const { name, location, pricePerHour, description, availability } = req.body;
    const image = req.file ? req.file.path : null;
    
    // Validate availability if provided
    if (availability) {
      const validationResult = validateAvailabilitySlots(availability);
      if (!validationResult.valid) {
        return res.status(400).json({ message: validationResult.message });
      }
    }

    const turf = await Turf.create({
      name,
      location,
      image,
      pricePerHour,
      description,
      owner: req.user._id,
      availability: availability || [],
    });

    res.status(201).json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Turfs
const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find();
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Turf by ID
const getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    res.json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Turf Availability
const updateTurfAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const { id } = req.params;
    
    // Validate the provided availability slots
    const validationResult = validateAvailabilitySlots(availability);
    if (!validationResult.valid) {
      return res.status(400).json({ message: validationResult.message });
    }
    
    const turf = await Turf.findById(id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });
    
    // Ensure the current user is the turf owner
    if (turf.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this turf" });
    }
    
    turf.availability = availability;
    await turf.save();
    
    res.json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Turf (Admin Only)
const deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) return res.status(404).json({ message: "Turf not found" });

    await turf.deleteOne();
    res.json({ message: "Turf deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { 
  createTurf, 
  getAllTurfs, 
  getTurfById, 
  deleteTurf,
  updateTurfAvailability,
  validateAvailabilitySlots
};
