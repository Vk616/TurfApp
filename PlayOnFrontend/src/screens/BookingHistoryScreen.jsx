"use client"

import { useContext, useEffect, useState } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, StatusBar, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { AuthContext } from "../context/AuthContext"
import { getUserBookings, cancelBooking } from "../api/bookingApi"
import { LinearGradient } from "expo-linear-gradient"

const BookingHistoryScreen = () => {
  const { user } = useContext(AuthContext)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const data = await getUserBookings(user.token)
      setBookings(data)
    } catch (error) {
      console.error("Error fetching bookings:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchBookings()
  }

  const handleCancelBooking = (bookingId) => {
    Alert.alert("Cancel Booking", "Are you sure you want to cancel this booking?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes",
        style: "destructive",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelBooking(user.token, bookingId)
            fetchBookings() // Refresh bookings after cancellation
            Alert.alert("Success", "Booking cancelled successfully")
          } catch (error) {
            Alert.alert("Error", "Failed to cancel booking")
          }
        },
      },
    ])
  }

  const getStatusColor = (date, timeSlot) => {
    const today = new Date()
    const bookingDate = new Date(date)

    // If booking date is in the past
    if (bookingDate < today) {
      return {
        color: "#888",
        background: "rgba(136, 136, 136, 0.2)",
        text: "Completed",
      }
    }

    // If booking date is today
    if (bookingDate.toDateString() === today.toDateString()) {
      return {
        color: "#4CAF50",
        background: "rgba(76, 175, 80, 0.2)",
        text: "Today",
      }
    }

    // If booking date is in the future
    return {
      color: "#ff5555",
      background: "rgba(255, 85, 85, 0.2)",
      text: "Upcoming",
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#111", "#000"]} style={styles.header}>
        <Text style={styles.title}>My Bookings</Text>
      </LinearGradient>

      {bookings.length === 0 ? (
        <View style={styles.noBookingContainer}>
          <Ionicons name="calendar-outline" size={80} color="#ff5555" />
          <Text style={styles.noBookingText}>No bookings found</Text>
          <Text style={styles.noBookingSubtext}>Book a turf to see your bookings here</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.listContent}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          renderItem={({ item }) => {
            // Skip rendering if item.turf is null/undefined
            if (!item.turf) {
              return null;
            }
            
            const statusStyle = getStatusColor(item.date, item.timeSlot)

            return (
              <View style={styles.bookingCard}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusBadge, { backgroundColor: statusStyle.background }]}>
                    <Text style={[styles.statusText, { color: statusStyle.color }]}>{statusStyle.text}</Text>
                  </View>
                  <TouchableOpacity style={styles.moreButton} onPress={() => handleCancelBooking(item._id)}>
                    <Ionicons name="close-circle-outline" size={24} color="#ff5555" />
                  </TouchableOpacity>
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.turfImageContainer}>
                    <Image
                      source={{
                        uri:
                          (item.turf && item.turf.image) || "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000",
                      }}
                      style={styles.turfImage}
                    />
                  </View>

                  <View style={styles.bookingDetails}>
                    <Text style={styles.turfName}>{item.turf ? item.turf.name : "Unknown Turf"}</Text>

                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color="#ff5555" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{new Date(item.date).toDateString()}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color="#ff5555" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{item.timeSlot}</Text>
                    </View>

                    <View style={styles.detailRow}>
                      <Ionicons name="location-outline" size={16} color="#ff5555" style={styles.detailIcon} />
                      <Text style={styles.detailText}>{item.turf ? item.turf.location : "Unknown Location"}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "left",
  },
  listContent: {
    padding: 16,
  },
  noBookingContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    padding: 20,
  },
  noBookingText: {
    fontSize: 20,
    color: "#fff",
    marginTop: 20,
    fontWeight: "bold",
  },
  noBookingSubtext: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 10,
    textAlign: "center",
  },
  bookingCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  moreButton: {
    padding: 5,
  },
  cardContent: {
    flexDirection: "row",
    padding: 15,
  },
  turfImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 15,
  },
  turfImage: {
    width: "100%",
    height: "100%",
  },
  bookingDetails: {
    flex: 1,
  },
  turfName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    color: "#bbb",
    fontSize: 14,
  },
})

export default BookingHistoryScreen

