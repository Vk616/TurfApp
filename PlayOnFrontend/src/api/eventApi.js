import axios from "axios";
import Constants from 'expo-constants';

const API= Constants.expoConfig.extra.API_URL;
const API_URL = "${API}api/events"; // Update with your backend IP if needed

export const getAllEvents = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};
