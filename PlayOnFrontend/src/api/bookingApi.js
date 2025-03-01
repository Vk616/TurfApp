import axios from "axios";

// Set the base URL of the backend
const API_URL = "http://192.168.1.2:5000/api/bookings";

// Create a Booking
export const createBooking = async (token, turfId, date, timeSlot) => {
  try {
    const response = await axios.post(
      API_URL,
      { turf: turfId, date, timeSlot },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get User Bookings
export const getUserBookings = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Cancel Booking
export const cancelBooking = async (token, bookingId) => {
  try {
    const response = await axios.delete(`${API_URL}/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
