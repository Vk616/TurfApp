const nodemailer = require("nodemailer");

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email app password
  },
});

// Function to send booking confirmation email
const sendBookingConfirmation = async (userEmail, bookingDetails) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: "Booking Confirmation - PlayOn Turf",
      html: `
        <h2>Your Booking is Confirmed!</h2>
        <p>Hi,</p>
        <p>Your booking has been successfully confirmed for:</p>
        <ul>
          <li><b>Turf:</b> ${bookingDetails.turfName}</li>
          <li><b>Date:</b> ${bookingDetails.date}</li>
          <li><b>Time Slot:</b> ${bookingDetails.timeSlot}</li>
        </ul>
        <p>Enjoy your game!</p>
        <p>PlayOn Turf Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to ${userEmail}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendBookingConfirmation };
