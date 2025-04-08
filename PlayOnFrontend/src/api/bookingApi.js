import axios from "axios"
import Constants from "expo-constants"

const API = Constants.expoConfig.extra.API_URL
const API_URL = `${API}api/bookings`

// Create a Booking
export const createBooking = async (token, turfId, date, startTime, endTime) => {
  try {
    // This function now understands that endTime represents the start of the last slot,
    // not including that slot in the booking
    const response = await axios.post(
      API_URL,
      { turf: turfId, date, startTime, endTime },
      { headers: { Authorization: `Bearer ${token}` } },
    )
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

export const getBookedTimeSlots = async (token, turfId, date) => {
  try {
    const response = await axios.get(`${API_URL}/booked-slots?turfId=${turfId}&date=${date}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

export const getAvailableTimeSlots = async (token, turfId, date) => {
  try {
    const response = await axios.get(`${API_URL}/available-slots?turfId=${turfId}&date=${date}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

// Get User Bookings
export const getUserBookings = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

// Cancel Booking
export const cancelBooking = async (token, bookingId) => {
  try {
    const response = await axios.delete(`${API_URL}/${bookingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return response.data
  } catch (error) {
    throw error.response ? error.response.data : error
  }
}

