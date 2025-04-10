const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Turf = require("./src/models/Turf");

dotenv.config();

// Helper function to parse time strings like "10:00 AM - 11:00 AM" into Date objects
const parseTimeSlot = (timeSlotString, baseDate = new Date()) => {
  try {
    const [startTimeStr, endTimeStr] = timeSlotString.split(" - ");
    
    // Set base date with time components reset
    const dateCopy = new Date(baseDate);
    dateCopy.setHours(0, 0, 0, 0);
    
    // Parse start time
    const startDate = new Date(dateCopy);
    const [startHourStr, startMinStr] = startTimeStr.split(":");
    let startHour = parseInt(startHourStr, 10);
    const startMin = parseInt(startMinStr.split(" ")[0], 10);
    const startAmPm = startTimeStr.includes("PM");
    
    if (startAmPm && startHour !== 12) startHour += 12;
    if (!startAmPm && startHour === 12) startHour = 0;
    
    startDate.setHours(startHour, startMin, 0, 0);
    
    // Parse end time
    const endDate = new Date(dateCopy);
    const [endHourStr, endMinStr] = endTimeStr.split(":");
    let endHour = parseInt(endHourStr, 10);
    const endMin = parseInt(endMinStr.split(" ")[0], 10);
    const endAmPm = endTimeStr.includes("PM");
    
    if (endAmPm && endHour !== 12) endHour += 12;
    if (!endAmPm && endHour === 12) endHour = 0;
    
    endDate.setHours(endHour, endMin, 0, 0);
    
    return { start: startDate, end: endDate };
  } catch (error) {
    console.error(`Error parsing time slot "${timeSlotString}":`, error);
    return null;
  }
};

// Migration function to update all turf documents
const migrateAvailability = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");

    // Get all turfs from database
    const turfs = await Turf.find();
    console.log(`Found ${turfs.length} turfs to migrate`);

    // Process each turf
    let migratedCount = 0;
    let skippedCount = 0;
    
    for (const turf of turfs) {
      // Skip if availability is already in the new format
      if (turf.availability.length > 0 && turf.availability[0].start instanceof Date) {
        console.log(`Skipping turf ${turf._id} (${turf.name}): already migrated`);
        skippedCount++;
        continue;
      }
      
      // Convert string array to time slot objects
      const newAvailability = [];
      
      // Base date for today and next 6 days (1 week total)
      const baseDate = new Date();
      
      // Process each string in the availability array
      if (Array.isArray(turf.availability)) {
        for (const timeSlotString of turf.availability) {
          // Create time slots for the next 7 days
          for (let day = 0; day < 7; day++) {
            const slotDate = new Date(baseDate);
            slotDate.setDate(slotDate.getDate() + day);
            
            const timeSlot = parseTimeSlot(timeSlotString, slotDate);
            if (timeSlot) {
              newAvailability.push(timeSlot);
            }
          }
        }
      }
      
      // Update the document
      turf.availability = newAvailability;
      await turf.save();
      console.log(`✅ Migrated turf ${turf._id} (${turf.name}): ${newAvailability.length} slots created`);
      migratedCount++;
    }

    console.log(`\nMigration complete:`);
    console.log(`- ${migratedCount} turfs migrated`);
    console.log(`- ${skippedCount} turfs skipped (already migrated)`);
    console.log(`- ${turfs.length} total turfs processed`);

    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
};

// Run the migration
migrateAvailability();