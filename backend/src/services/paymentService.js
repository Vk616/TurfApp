const processMockPayment = async (req, res) => {
    try {
      const { amount, userId, turfId } = req.body;
  
      // Simulate payment verification
      if (!amount || !userId || !turfId) {
        return res.status(400).json({ message: "Invalid payment details" });
      }
  
      // Mock successful payment response
      res.json({
        success: true,
        message: "Payment successful (mock)",
        transactionId: `MOCK_TXN_${Math.floor(Math.random() * 1000000)}`,
      });
    } catch (error) {
      res.status(500).json({ message: "Payment processing error" });
    }
  };
  
  module.exports = { processMockPayment };
  