import React, { useContext, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { createBooking } from "../api/bookingApi";

const BookingScreen = ({ route, navigation }) => {
  const { turfId } = route.params || {};  // Ensure turfId is extracted safely
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  if (!turfId) {
    return <Text>Error: Turf ID is missing!</Text>;  // Prevent app from crashing
  }

  const handleBooking = async () => {
    try {
      await createBooking(user.token, turfId, date, timeSlot);
      alert("Booking Successful!");
      navigation.navigate("Home");
    } catch (error) {
      alert("Booking Failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Turf</Text>
      <TextInput style={styles.input} placeholder="YYYY-MM-DD" onChangeText={setDate} />
      <TextInput style={styles.input} placeholder="10:00 AM - 11:00 AM" onChangeText={setTimeSlot} />
      <Button title="Confirm Booking" onPress={handleBooking} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: "bold" },
  input: { borderWidth: 1, padding: 10, marginBottom: 10, borderRadius: 8 },
});

export default BookingScreen;
