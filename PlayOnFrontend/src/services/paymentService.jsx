import axios from "axios";

const API_URL = "http://192.168.2.103:5000/api/payments";

// Mock Payment Processing (No actual gateway integration yet)
export const processPayment = async (token, amount, userId, turfId) => {
  try {
    const response = await axios.post(
      `${API_URL}/mock-payment`,
      { amount, userId, turfId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
