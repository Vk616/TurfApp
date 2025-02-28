import React, { useContext, useEffect, useState } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // Date Picker
import { AuthContext } from "../context/AuthContext";
import { createBooking, getUserBookings } from "../api/bookingApi";

// Function to generate time slots from 7 AM to 12 AM
const generateTimeSlots = () => {
  const slots = [];
  let hour = 7; // Start time
  while (hour < 24) {
    let formattedHour = hour > 12 ? hour - 12 : hour;
    let ampm = hour >= 12 ? "PM" : "AM";
    slots.push(`${formattedHour}:00 ${ampm}`);
    hour++;
  }
  return slots;
};

const BookingScreen = ({ route, navigation }) => {
  const { turfId } = route.params || {};
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTimes, setEndTimes] = useState([]); // End times based on start time
  const [selectedEndTime, setSelectedEndTime] = useState(null);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (!turfId) {
      fetchBookings();
    }
  }, []);

  const fetchBookings = async () => {
    try {
      const data = await getUserBookings(user.token);
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };

  if (!turfId) {
    // Display booking history when no turfId is provided
    return (
      <View style={styles.container}>
        <Text style={styles.title}>My Bookings</Text>
        {bookings.length === 0 ? (
          <Text>No bookings found.</Text>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.bookingItem}>
                <Text style={styles.bookingText}>
                  Turf: {item.turf.name} | Date: {item.date} | Time: {item.timeSlot}
                </Text>
              </View>
            )}
          />
        )}
      </View>
    );
  }

  // Handle start time selection
  const handleStartTimeSelection = (time) => {
    setStartTime(time);
    setSelectedEndTime(null); // Reset end time selection

    // Calculate possible end times (max 3 hours later)
    const allSlots = generateTimeSlots();
    const startIndex = allSlots.indexOf(time);
    if (startIndex !== -1) {
      setEndTimes(allSlots.slice(startIndex + 1, startIndex + 4)); // Next 3 slots
    }
  };

  const handleBooking = async () => {
    if (!startTime || !selectedEndTime) {
      alert("Please select both start and end times!");
      return;
    }

    try {
      await createBooking(user.token, turfId, date.toISOString().split("T")[0], `${startTime} - ${selectedEndTime}`);
      alert("Booking Successful!");
      navigation.navigate("Main", { screen: "Home" });
    } catch (error) {
      alert("Booking Failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Turf</Text>

      {/* Date Picker */}
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text style={styles.dateText}>Select Date: {date.toDateString()}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
        />
      )}

      {/* Start Time Selection */}
      <Text style={styles.subtitle}>Select Start Time</Text>
      <FlatList
        data={generateTimeSlots()}
        numColumns={3}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.timeSlotButton, startTime === item && styles.selectedTimeSlot]}
            onPress={() => handleStartTimeSelection(item)}
          >
            <Text style={styles.timeSlotText}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      {/* End Time Selection (only shown after start time is selected) */}
      {startTime && (
        <>
          <Text style={styles.subtitle}>Select End Time (Max 3 Hours)</Text>
          <FlatList
            data={endTimes}
            numColumns={3}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.timeSlotButton, selectedEndTime === item && styles.selectedTimeSlot]}
                onPress={() => setSelectedEndTime(item)}
              >
                <Text style={styles.timeSlotText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </>
      )}

      <Button title="Confirm Booking" onPress={handleBooking} color="#007bff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  subtitle: { fontSize: 18, fontWeight: "600", marginTop: 15, marginBottom: 10 },
  errorText: { color: "red", fontSize: 16, textAlign: "center", marginTop: 20 },
  dateButton: { padding: 12, backgroundColor: "#007bff", borderRadius: 8, marginBottom: 15 },
  dateText: { color: "white", fontSize: 16, textAlign: "center" },
  timeSlotButton: {
    flex: 1,
    padding: 10,
    margin: 5,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
  selectedTimeSlot: { backgroundColor: "#007bff" },
  timeSlotText: { fontSize: 16, fontWeight: "500" },
  bookingItem: { padding: 10, borderBottomWidth: 1 },
  bookingText: { fontSize: 16 },
});

export default BookingScreen;