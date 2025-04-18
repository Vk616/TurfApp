import axios from "axios";
import Constants from 'expo-constants';

const API = Constants.expoConfig.extra.API_URL;

const API_URL = `${API}api/admin`; // Change to backend IP if needed

export const getAllUsers = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getAllBookings = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/bookings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw error;
  }
};

// New admin API functions
export const getAllTurfs = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/turfs`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching turfs:", error);
    throw error;
  }
};

export const getDashboardStats = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/dashboard-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error;
  }
};

export const updateBookingStatus = async (bookingId, status, token) => {
  try {
    const response = await axios.patch(
      `${API_URL}/booking/${bookingId}`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating booking:", error);
    throw error;
  }
};

export const deleteBooking = async (bookingId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/booking/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting booking:", error);
    throw error;
  }
};

export const deleteUser = async (userId, token) => {
  try {
    const response = await axios.delete(`${API_URL}/user/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
