const Turf = require("../models/Turf");
const { uploadImage, uploadMultipleImages, deleteImage } = require("../config/cloudinaryConfig");

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

// Create Turf
const createTurf = async (req, res) => {
  try {
    const { name, location, pricePerHour, description, amenities, customAmenities } = req.body;
    
    // Process images from multer
    let mainImageUrl = null;
    let additionalImageUrls = [];
    
    // Handle main image
    if (req.files && req.files.image && req.files.image.length > 0) {
      mainImageUrl = req.files.image[0].path;
    }
    
    // Handle additional images
    if (req.files && req.files.additionalImages && req.files.additionalImages.length > 0) {
      additionalImageUrls = req.files.additionalImages.map(file => file.path);
    }
    
    // Parse amenities if provided
    let amenitiesObj = {
      water: true,
      parking: true,
      floodlights: true,
      changingRoom: true,
      beverages: false,
      equipment: false
    };
    
    if (amenities) {
      try {
        const parsedAmenities = JSON.parse(amenities);
        amenitiesObj = { ...amenitiesObj, ...parsedAmenities };
      } catch (error) {
        console.error("Error parsing amenities:", error);
      }
    }
    
    // Parse custom amenities if provided
    let customAmenitiesArr = [];
    if (customAmenities) {
      try {
        customAmenitiesArr = JSON.parse(customAmenities);
      } catch (error) {
        console.error("Error parsing custom amenities:", error);
      }
    }
    
    // Create the turf
    const newTurf = await Turf.create({
      name,
      location,
      image: mainImageUrl,
      images: additionalImageUrls,
      description,
      pricePerHour: Number(pricePerHour),
      owner: req.user._id,
      amenities: amenitiesObj,
      customAmenities: customAmenitiesArr
    });
    
    res.status(201).json(newTurf);
  } catch (error) {
    console.error("Error creating turf:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all Turfs
const getAllTurfs = async (req, res) => {
  try {
    const turfs = await Turf.find().sort({ createdAt: -1 });
    res.json(turfs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Turf by ID
const getTurfById = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    res.json(turf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Turf details
const updateTurf = async (req, res) => {
  try {
    const { 
      name, location, pricePerHour, description, 
      amenities, customAmenities, removeImages 
    } = req.body;
    
    const turfId = req.params.id;
    const turf = await Turf.findById(turfId);
    
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    
    // Check if user is authorized (admin or turf owner)
    if (req.user.role !== "admin" && turf.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this turf" });
    }
    
    // Update basic fields if provided
    if (name) turf.name = name;
    if (location) turf.location = location;
    if (pricePerHour) turf.pricePerHour = Number(pricePerHour);
    if (description) turf.description = description;
    
    // Handle main image update
    if (req.files && req.files.image && req.files.image.length > 0) {
      // Delete old image if exists
      if (turf.image) {
        await deleteImage(turf.image);
      }
      turf.image = req.files.image[0].path;
    }
    
    // Handle additional images
    if (req.files && req.files.additionalImages && req.files.additionalImages.length > 0) {
      const newImageUrls = req.files.additionalImages.map(file => file.path);
      turf.images = [...(turf.images || []), ...newImageUrls];
    }
    
    // Handle image removals
    if (removeImages) {
      try {
        const imagesToRemove = JSON.parse(removeImages);
        
        // Delete each image from Cloudinary
        for (const imageUrl of imagesToRemove) {
          await deleteImage(imageUrl);
        }
        
        // Remove from turf.images array
        turf.images = turf.images.filter(img => !imagesToRemove.includes(img));
      } catch (error) {
        console.error("Error processing image removals:", error);
      }
    }
    
    // Update amenities if provided
    if (amenities) {
      try {
        const parsedAmenities = JSON.parse(amenities);
        turf.amenities = { ...turf.amenities, ...parsedAmenities };
      } catch (error) {
        console.error("Error parsing amenities:", error);
      }
    }
    
    // Update custom amenities if provided
    if (customAmenities) {
      try {
        turf.customAmenities = JSON.parse(customAmenities);
      } catch (error) {
        console.error("Error parsing custom amenities:", error);
      }
    }
    
    // Save the updated turf
    const updatedTurf = await turf.save();
    res.json(updatedTurf);
  } catch (error) {
    console.error("Error updating turf:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update Turf Availability
const updateTurfAvailability = async (req, res) => {
  try {
    const { availability } = req.body;
    const turfId = req.params.id;
    
    const turf = await Turf.findById(turfId);
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    
    // Check if user is authorized (admin or turf owner)
    if (req.user.role !== "admin" && turf.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this turf" });
    }
    
    turf.availability = availability;
    const updatedTurf = await turf.save();
    
    res.json(updatedTurf);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Turf
const deleteTurf = async (req, res) => {
  try {
    const turf = await Turf.findById(req.params.id);
    
    if (!turf) {
      return res.status(404).json({ message: "Turf not found" });
    }
    
    // Check if user is authorized (admin or turf owner)
    if (req.user.role !== "admin" && turf.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this turf" });
    }
    
    // Delete images from Cloudinary
    if (turf.image) {
      await deleteImage(turf.image);
    }
    
    if (turf.images && turf.images.length > 0) {
      for (const imageUrl of turf.images) {
        await deleteImage(imageUrl);
      }
    }
    
    // Delete the turf
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
  updateTurf,
  updateTurfAvailability,
  deleteTurf,
  validateAvailabilitySlots
};
