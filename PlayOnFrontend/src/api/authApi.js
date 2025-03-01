import axios from "axios";

// Set the base URL of the backend
const API_URL = "http://192.168.1.2:5000/api/auth";

// User Registration
export const registerUser = async (name, email, password, phone) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      name,
      email,
      password,
      phone,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// User Login
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// User Logout
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};
