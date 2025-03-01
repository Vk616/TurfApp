import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { getUserBookings } from "../api/bookingApi";

const BookingHistoryScreen = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getUserBookings(user.token);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📅 My Bookings</Text>

      {bookings.length === 0 ? (
        <View style={styles.noBookingContainer}>
          <Ionicons name="calendar-outline" size={60} color="#007bff" />
          <Text style={styles.noBookingText}>No bookings found.</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <Text style={styles.bookingText}>Turf: {item.turf.name}</Text>
              <Text style={styles.bookingText}>Date: {item.date}</Text>
              <Text style={styles.bookingText}>Time: {item.timeSlot}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  bookingCard: { backgroundColor: "#007bff", padding: 15, borderRadius: 10, marginVertical: 8 },
  bookingText: { fontSize: 16, color: "#fff" },
});

export default BookingHistoryScreen;
