const sendNotification = async (userId, message) => {
    try {
      // Placeholder logic (In a real app, use Firebase Cloud Messaging or OneSignal)
      console.log(`📢 Notification sent to User(${userId}): ${message}`);
      return { success: true, message: "Notification sent successfully" };
    } catch (error) {
      console.error("❌ Notification Error:", error);
      return { success: false, message: "Failed to send notification" };
    }
  };
  
  module.exports = { sendNotification };
  