import axios from "axios";
const API = process.env.EXPO_PUBLIC_API_URL;
const API_URL = `${API}api/bookings`;

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

export const getBookedTimeSlots = async (token, turfId, date) => {
  const response = await fetch(
   `${API_URL}/booked-slots?turfId=${turfId}&date=${date}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch booked slots");
  }

  return await response.json();
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
