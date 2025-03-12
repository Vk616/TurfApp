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
