import axios from "axios";
const API = process.env.EXPO_PUBLIC_API_URL;
const API_URL = `${API}api/turfs`;

// Fetch all Turfs
export const getAllTurfs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get Turf Details by ID
export const getTurfById = async (turfId) => {
  try {
    const response = await axios.get(`${API_URL}/${turfId}`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Create Turf (Admin Only)
export const createTurf = async (token, formData) => {
  try {
    const response = await axios.post(API_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Delete Turf (Admin Only)
export const deleteTurf = async (token, turfId) => {
  try {
    const response = await axios.delete(`${API_URL}/${turfId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
