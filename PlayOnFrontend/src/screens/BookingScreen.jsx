import React, { useContext, useState, useEffect } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AuthContext } from "../context/AuthContext";
import { createBooking } from "../api/bookingApi";

// Generate time slots from 7 AM to 12 AM
const generateTimeSlots = () => {
  const slots = [];
  let hour = 7;
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
  const [endTimes, setEndTimes] = useState([]);
  const [selectedEndTime, setSelectedEndTime] = useState(null);

  // Handle start time selection
  const handleStartTimeSelection = (time) => {
    setStartTime(time);
    setSelectedEndTime(null);
    const allSlots = generateTimeSlots();
    const startIndex = allSlots.indexOf(time);
    if (startIndex !== -1) {
      setEndTimes(allSlots.slice(startIndex + 1, startIndex + 4));
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
      navigation.navigate("Main", { screen: "My Bookings" });
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

      {/* End Time Selection */}
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
  dateButton: { padding: 12, backgroundColor: "#007bff", borderRadius: 8, marginBottom: 15 },
  dateText: { color: "white", fontSize: 16, textAlign: "center" },
  timeSlotButton: { flex: 1, padding: 10, margin: 5, backgroundColor: "#f0f0f0", borderRadius: 8, alignItems: "center" },
  selectedTimeSlot: { backgroundColor: "#007bff" },
  timeSlotText: { fontSize: 16, fontWeight: "500" },
});

export default BookingScreen;
