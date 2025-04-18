import mongoose from "mongoose";
import dotenv from "dotenv";
import Turf from "./src/models/Turf.js"; // Ensure correct import
import User from "./src/models/User.js"; // Needed for turf owners
import bcrypt from "bcryptjs"; // Added for password hashing

dotenv.config();

// **Function to Generate Time Slots (7 AM - 11 PM)**
const generateTimeSlots = () => {
  const slots = [];
  // Get current date as base
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0); // Reset time to start of day
  
  // Generate slots for next 7 days
  for (let day = 0; day < 7; day++) {
    const currentDate = new Date(baseDate);
    currentDate.setDate(currentDate.getDate() + day);
    
    // Generate hourly slots from 7 AM to 11 PM
    for (let hour = 7; hour < 23; hour++) {
      const startTime = new Date(currentDate);
      startTime.setHours(hour, 0, 0, 0);
      
      const endTime = new Date(currentDate);
      endTime.setHours(hour + 1, 0, 0, 0);
      
      slots.push({
        start: startTime,
        end: endTime
      });
    }
  }
  
  return slots;
};

// **Turf Data (Extracted from index.html)**
const turfs = [
  {
    name: "Optimus Turf",
    location: "150, Ambattur Red Hills Rd, Bharati Nagar, Ambattur, Chennai",
    image: "https://lh3.googleusercontent.com/p/AF1QipPoXlvimFtptMWGo2ZScBkK8oNCt8IwuZ27S9PQ=s1360-w1360-h1020",
    description: "A well-maintained football turf for all age groups.",
    pricePerHour: 40,
  },
  {
    name: "The Infinite Turf",
    location: "T.S No 58 &59/2, Water Canal Rd, Mugambigai Nagar, Korattur, Chennai, Tamil Nadu 600076",
    image: "https://lh3.googleusercontent.com/p/AF1QipMJhcFwey-Ma9_6kQXC7igFzWkMHwoVFIkNLlB-=s1360-w1360-h1020",
    description: "Premium turf with excellent lighting and maintenance.",
    pricePerHour: 50,
  },
  {
    name: "Definitely Not Turf",
    location: "3rd St, Palavarai, Soba Teachers Nagar, Vinayakapuram, Chennai, Tamil Nadu 600099",
    image: "https://lh3.googleusercontent.com/p/AF1QipNkAUx1fVdR2R2v7-SYdEYC5PWWVrkHkDxkLWS9=s1360-w1360-h1020",
    description: "High-quality artificial grass for the best experience.",
    pricePerHour: 45,
  },
  {
    name: "Football Turf",
    location: "Church Road, No.21, Annamalai Ave, Nolambur, Chennai, Tamil Nadu 600107",
    image: "https://lh3.googleusercontent.com/p/AF1QipNRE06YpmYAYkwalzQ3uBh_UkbJjGRDW-ybkrHk=s1360-w1360-h1020",
    description: "A multi-sport ground with excellent turf quality.",
    pricePerHour: 55,
  },
  {
    name: "BERLIN SPORTS ACADEMY TURF",
    location: "563Q+437, Ganesh Nagar, Kamban Nagar, Madhavaram, Chennai, Tamil Nadu 600060",
    image: "https://lh3.googleusercontent.com/p/AF1QipPYISUeeSrsz0AOgR22LP_3t1CR3ghQOpSZB5zO=s1360-w1360-h1020",
    description: "A professional-grade sports academy turf.",
    pricePerHour: 60,
  },
  {
    name: "Madras Arena Turf & Badminton",
    location: "Near Yamaha show room, Balaji Nagar, Thirumullaivoyal, Chennai, Tamil Nadu 600062",
    image: "https://lh3.googleusercontent.com/p/AF1QipMhgBbUsh3jLz21T38NITsZQ9gvETwETvkcFQHR=s1360-w1360-h1020",
    description: "Multi-sport arena featuring football and badminton.",
    pricePerHour: 50,
  },
  {
    name: "Champions Turf",
    location: "MCK Layout, near Schram Academy School, Nolambur, Chennai, Tamil Nadu 600095",
    image: "https://lh3.googleusercontent.com/p/AF1QipMDSvIzobrhC_40OSs6WdYBWW-a5G706MIfijlT=s1360-w1360-h1020",
    description: "A premium training ground for upcoming champions.",
    pricePerHour: 45,
  },
  {
    name: "A Kube Sports Kingdom",
    location: "No.167, Jayanthi Nagar, Karukku, Ambattur, Chennai, Tamil Nadu 600053",
    image: "https://lh3.googleusercontent.com/gps-cs-s/AB5caB_1Pej6KWfK1CrSc-BFJPO3bVCHt9BXiHotnTS_cc0cTw6bXkEsExYCINVm4REI3YE-u8l9Pt6ePNtwyPeRb5IvT_4W_ulPyvtSk4nnen0BLhmJUNchSxjHcTGmUbQWup4Eas0=s1360-w1360-h1020",
    description: "A state-of-the-art facility for sports lovers.",
    pricePerHour: 55,
  },
];

// **Function to Seed Database**
const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected");

    // **Clear Existing Turf Data**
    await Turf.deleteMany();
    console.log("🗑️ Existing turfs removed");

    // **Create Admin User if not exists**
    let adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("🔧 Creating admin user...");
      
      // NOTE: No need to hash password manually - User model will do it via pre-save hook
      adminUser = await User.create({
        name: "Admin User",
        email: "admin@playonturf.com",
        password: "admin123", // Plain password - will be hashed by the User model
        phone: "1234567890",
        role: "admin"
      });
      console.log(`✅ Admin user created with email: ${adminUser.email} and password: admin123`);
    } else {
      console.log("✅ Admin user already exists");
    }

    // Create Turf Owner User if not exists
    let turfOwnerUser = await User.findOne({ email: "turfowner@playonturf.com" });
    if (!turfOwnerUser) {
      console.log("🔧 Creating turf owner user...");
      
      turfOwnerUser = await User.create({
        name: "Turf Owner",
        email: "turfowner@playonturf.com",
        password: "turfowner123", // Will be hashed by the User model
        phone: "9876543210",
        role: "turf_owner"
      });
      console.log(`✅ Turf owner created with email: ${turfOwnerUser.email} and password: turfowner123`);
    } else {
      console.log("✅ Turf owner already exists");
    }

    // Assign some turfs to the turf owner
    // You can modify this as needed
    const turfsWithSlots = turfs.map((turf, index) => ({
      ...turf,
      // Example: Assign odd-indexed turfs to turf owner
      owner: index % 2 === 0 ? adminUser._id : turfOwnerUser._id,
      availability: generateTimeSlots(),
    }));

    await Turf.insertMany(turfsWithSlots);
    console.log("✅ Turfs inserted successfully");

    process.exit();
  } catch (error) {
    console.error("❌ Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
