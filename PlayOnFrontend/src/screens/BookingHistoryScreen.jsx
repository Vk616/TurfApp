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
          <Ionicons name="calendar-outline" size={60} color="#ff0000" />
          <Text style={styles.noBookingText}>No bookings found.</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <View style={styles.bookingHeader}>
                <Ionicons name="football-outline" size={20} color="#ff0000" style={styles.icon} />
                <Text style={styles.bookingTitle}>{item.turf.name}</Text>
              </View>
              <Text style={styles.bookingDetail}>📅 Date: {item.date}</Text>
              <Text style={styles.bookingDetail}>⏰ Time: {item.timeSlot}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#111", // Dark background
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#fff",
    textAlign: "center",
  },
  noBookingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  noBookingText: {
    fontSize: 18,
    color: "#ccc",
    marginTop: 10,
  },
  bookingCard: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ff0000",
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  bookingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bookingTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  bookingDetail: {
    fontSize: 16,
    color: "#ddd",
    marginBottom: 3,
  },
  icon: {
    color: "#ff0000",
  },
});

export default BookingHistoryScreen;