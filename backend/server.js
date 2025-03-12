require("dotenv").config();
const express = require("express");
const connectDB = require("./src/config/db");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const turfRoutes = require("./src/routes/turfRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");
const reviewRoutes = require("./src/routes/reviewRoutes");
const eventRoutes = require("./src/routes/eventRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");

connectDB(); // Connect to MongoDB

const app = express();

// Middleware
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));
app.use(morgan("dev"));
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/turfs", turfRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Sample Home Route
app.get("/", (req, res) => {
  res.send("Welcome to PlayOn Backend!");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
