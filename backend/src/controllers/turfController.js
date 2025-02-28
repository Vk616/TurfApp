const Turf = require("../models/Turf");

// Create Turf (Admin Only)
const createTurf = async (req, res) => {
  try {
    const { name, location, pricePerHour, description } = req.body;
    const image = req.file ? req.file.path : null;

    const turf = await Turf.create({
      name,
      location,
      image,
      pricePerHour,
      description,
      owner: req.user._id,
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

module.exports = { createTurf, getAllTurfs, getTurfById, deleteTurf };
