import axios from "axios";

const API_URL = "http://192.168.1.2:5000/api/events"; // Update with your backend IP if needed

export const getAllEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
