import mongoose from "mongoose";
import dotenv from "dotenv";
import Turf from "./src/models/Turf.js"; // Ensure correct import
import User from "./src/models/User.js"; // Needed for turf owners

dotenv.config();

// **Function to Generate Time Slots (7 AM - 11 PM)**
const generateTimeSlots = () => {
  const slots = [];
  let hour = 7; // Start time
  while (hour < 23) { // End time is 11 PM (23:00)
    let formattedHour = hour > 12 ? hour - 12 : hour;
    let ampm = hour >= 12 ? "PM" : "AM";
    slots.push(`${formattedHour}:00 ${ampm} - ${formattedHour + 1}:00 ${ampm}`);
    hour++;
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

    // **Find an Admin User (Turf Owner)**
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.log("❌ No admin user found. Create an admin first.");
      process.exit(1);
    }

    // **Insert Turfs with Generated Time Slots**
    const turfsWithSlots = turfs.map((turf) => ({
      ...turf,
      owner: adminUser._id, // Assigning an admin as the turf owner
      availability: generateTimeSlots(),
      rating: Math.floor(Math.random() * 5) + 1,
      totalReviews: Math.floor(Math.random() * 100),
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
