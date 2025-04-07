"use client"

import { useContext, useEffect, useState, useRef } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
  Modal,
} from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { AuthContext } from "../context/AuthContext"
import { createBooking, getAvailableTimeSlots } from "../api/bookingApi"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Button from "../components/Button"

const BookingScreen = ({ route, navigation }) => {
  const { turfId, turfName } = route.params || {}
  const { user } = useContext(AuthContext)
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [availableSlots, setAvailableSlots] = useState([])
  const [selectedStartSlot, setSelectedStartSlot] = useState(null)
  const [selectedEndSlot, setSelectedEndSlot] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showEndTimeModal, setShowEndTimeModal] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const modalScaleAnim = useRef(new Animated.Value(0.9)).current
  const modalOpacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    fetchAvailableSlots()

    // Start animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()
  }, [date])

  const fetchAvailableSlots = async () => {
    try {
      setLoading(true)
      setError(null)
      setSelectedStartSlot(null)
      setSelectedEndSlot(null)
      setShowEndTimeModal(false)

      const formattedDate = date.toISOString().split("T")[0]
      const response = await getAvailableTimeSlots(user.token, turfId, formattedDate)
      setAvailableSlots(response.availableSlots)
    } catch (error) {
      console.error("Error fetching available slots:", error)
      setError("Failed to load available time slots. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      // Ensure we don't allow past dates
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      if (selectedDate < today) {
        Alert.alert("Invalid Date", "Please select today or a future date.")
        return
      }

      setDate(selectedDate)
    }
  }

  const handleStartSlotSelection = (slot) => {
    setSelectedStartSlot(slot)
    setSelectedEndSlot(null)

    // Show end time modal with animation
    setShowEndTimeModal(true)
    Animated.parallel([
      Animated.timing(modalScaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(modalOpacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const handleEndSlotSelection = (slot) => {
    setSelectedEndSlot(slot)

    // Close modal after selection
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(modalScaleAnim, {
          toValue: 0.9,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setShowEndTimeModal(false)
      })
    }, 300)
  }

  const getAvailableEndSlots = () => {
    if (!selectedStartSlot) return []

    // Get the start time
    const startTime = new Date(selectedStartSlot.startTimeISO)

    // Filter slots that are after the selected start slot
    // and ensure there are no booked slots in between
    const potentialEndSlots = availableSlots.filter((slot) => {
      const slotTime = new Date(slot.startTimeISO)

      // End slot must be after start slot
      if (slotTime <= startTime) return false

      // Limit to 3 hours max
      if (slotTime - startTime > 3 * 60 * 60 * 1000) return false

      // Check if all slots between start and this potential end are available
      const allSlotsAvailable = availableSlots.every((intermediateSlot) => {
        const intermediateTime = new Date(intermediateSlot.startTimeISO)

        // If this slot is between start and potential end
        if (intermediateTime > startTime && intermediateTime < slotTime) {
          // It must be available
          return intermediateSlot.isAvailable
        }

        // Slot is not between, so it doesn't affect our decision
        return true
      })

      return allSlotsAvailable && slot.isAvailable
    })

    return potentialEndSlots
  }

  const handleBooking = async () => {
    if (!selectedStartSlot || !selectedEndSlot) {
      Alert.alert("Selection Required", "Please select both start and end times.")
      return
    }

    try {
      setBookingLoading(true)
      const formattedDate = date.toISOString().split("T")[0]

      await createBooking(user.token, turfId, formattedDate, selectedStartSlot.startTimeISO, selectedEndSlot.endTimeISO)

      Alert.alert("Booking Successful", "Your turf has been booked successfully!", [
        {
          text: "OK",
          onPress: () => navigation.navigate("Main", { screen: "Bookings" }),
        },
      ])
    } catch (error) {
      console.error("Booking error:", error)
      Alert.alert("Booking Failed", error.message || "There was an error processing your booking. Please try again.")
    } finally {
      setBookingLoading(false)
    }
  }

  const renderTimeSlots = () => {
    // Group slots by morning, afternoon, evening
    const morning = availableSlots.filter((slot) => {
      const hour = new Date(slot.startTimeISO).getHours()
      return hour >= 7 && hour < 12
    })

    const afternoon = availableSlots.filter((slot) => {
      const hour = new Date(slot.startTimeISO).getHours()
      return hour >= 12 && hour < 17
    })

    const evening = availableSlots.filter((slot) => {
      const hour = new Date(slot.startTimeISO).getHours()
      return hour >= 17 && hour < 24
    })

    return (
      <>
        {renderTimeSlotSection("Morning", morning)}
        {renderTimeSlotSection("Afternoon", afternoon)}
        {renderTimeSlotSection("Evening", evening)}
      </>
    )
  }

  const renderTimeSlotSection = (title, slots) => {
    if (slots.length === 0) return null

    return (
      <View style={styles.timeSection}>
        <Text style={styles.timeSectionTitle}>{title}</Text>
        <View style={styles.timeSlotsGrid}>
          {slots.map((slot, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.timeSlot,
                !slot.isAvailable && styles.bookedSlot,
                selectedStartSlot && slot.startTimeISO === selectedStartSlot.startTimeISO && styles.selectedStartSlot,
              ]}
              onPress={() => slot.isAvailable && handleStartSlotSelection(slot)}
              disabled={!slot.isAvailable}
            >
              <Text
                style={[
                  styles.timeSlotText,
                  !slot.isAvailable && styles.bookedSlotText,
                  selectedStartSlot && slot.startTimeISO === selectedStartSlot.startTimeISO && styles.selectedSlotText,
                ]}
              >
                {slot.displayTime}
              </Text>
              {!slot.isAvailable && (
                <Ionicons name="close-circle" size={16} color="#ff3333" style={styles.bookedIcon} />
              )}
              {selectedStartSlot && slot.startTimeISO === selectedStartSlot.startTimeISO && (
                <Text style={styles.slotLabel}>Start</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const renderEndTimeModal = () => {
    const endSlots = getAvailableEndSlots()

    return (
      <Modal
        visible={showEndTimeModal}
        transparent={true}
        animationType="none"
        onRequestClose={() => setShowEndTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                opacity: modalOpacityAnim,
                transform: [{ scale: modalScaleAnim }],
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select End Time</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowEndTimeModal(false)}>
                <Ionicons name="close" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSubtitle}>Choose when you want to finish (max 3 hours)</Text>

            {endSlots.length > 0 ? (
              <View style={styles.endTimeSlotsGrid}>
                {endSlots.map((slot, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.endTimeSlot,
                      selectedEndSlot && slot.startTimeISO === selectedEndSlot.startTimeISO && styles.selectedEndSlot,
                    ]}
                    onPress={() => handleEndSlotSelection(slot)}
                  >
                    <Text
                      style={[
                        styles.endTimeSlotText,
                        selectedEndSlot &&
                          slot.startTimeISO === selectedEndSlot.startTimeISO &&
                          styles.selectedSlotText,
                      ]}
                    >
                      {slot.displayTime}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <View style={styles.noSlotsContainer}>
                <Ionicons name="alert-circle-outline" size={40} color="#ff5555" />
                <Text style={styles.noSlotsText}>No available end times for this selection.</Text>
                <Text style={styles.noSlotsSubtext}>Please select a different start time.</Text>
              </View>
            )}
          </Animated.View>
        </View>
      </Modal>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#111", "#000"]} style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Turf</Text>
        <Text style={styles.headerSubtitle}>{turfName || "Select your time slot"}</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Select Date</Text>
          <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}>
            <Ionicons name="calendar-outline" size={20} color="#ff5555" style={styles.dateIcon} />
            <Text style={styles.dateText}>{date.toDateString()}</Text>
            <Ionicons name="chevron-down" size={20} color="#ff5555" />
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
              minimumDate={new Date()}
            />
          )}
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ff5555" />
            <Text style={styles.loadingText}>Loading available slots...</Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#ff5555" />
            <Text style={styles.errorText}>{error}</Text>
            <Button title="Try Again" onPress={fetchAvailableSlots} style={styles.retryButton} />
          </View>
        ) : (
          <>
            <View style={styles.timeSlotsContainer}>
              <Text style={styles.timeSlotsTitle}>Select Start Time</Text>
              <Text style={styles.timeSlotsSubtitle}>Choose when you want to start playing</Text>

              <View style={styles.legendContainer}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#222" }]} />
                  <Text style={styles.legendText}>Available</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#444" }]} />
                  <Text style={styles.legendText}>Booked</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, { backgroundColor: "#ff5555" }]} />
                  <Text style={styles.legendText}>Selected</Text>
                </View>
              </View>

              {renderTimeSlots()}
            </View>

            {selectedStartSlot && selectedEndSlot && (
              <View style={styles.summaryContainer}>
                <LinearGradient colors={["rgba(255,85,85,0.1)", "rgba(255,85,85,0.05)"]} style={styles.summaryGradient}>
                  <Text style={styles.summaryTitle}>Booking Summary</Text>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Date:</Text>
                    <Text style={styles.summaryValue}>{date.toDateString()}</Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Time:</Text>
                    <Text style={styles.summaryValue}>
                      {selectedStartSlot.displayTime} - {selectedEndSlot.displayTime}
                    </Text>
                  </View>

                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Duration:</Text>
                    <Text style={styles.summaryValue}>
                      {Math.round(
                        (new Date(selectedEndSlot.startTimeISO) - new Date(selectedStartSlot.startTimeISO)) /
                          (60 * 60 * 1000),
                      )}{" "}
                      hours
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {renderEndTimeModal()}

      {selectedStartSlot && selectedEndSlot && (
        <View style={styles.bottomBar}>
          <Button
            title="Confirm Booking"
            onPress={handleBooking}
            loading={bookingLoading}
            style={styles.confirmButton}
            icon={<Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />}
          />
        </View>
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
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#ff5555",
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  dateContainer: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 85, 85, 0.3)",
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  loadingContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "#ff5555",
    marginTop: 10,
    marginBottom: 20,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    width: 150,
  },
  timeSlotsContainer: {
    marginBottom: 20,
  },
  timeSlotsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  timeSlotsSubtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 15,
  },
  legendContainer: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 8,
    padding: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 5,
  },
  legendText: {
    color: "#aaa",
    fontSize: 12,
  },
  timeSection: {
    marginBottom: 20,
  },
  timeSectionTitle: {
    fontSize: 16,
    color: "#ff5555",
    marginBottom: 10,
    fontWeight: "500",
  },
  timeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  timeSlot: {
    width: "31%",
    margin: "1%",
    height: 50,
    backgroundColor: "#222",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  bookedSlot: {
    backgroundColor: "#444",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  selectedStartSlot: {
    backgroundColor: "#ff5555",
    borderColor: "#ff5555",
  },
  selectedEndSlot: {
    backgroundColor: "#ff5555",
    borderColor: "#ff5555",
  },
  timeSlotText: {
    color: "#fff",
    fontSize: 14,
  },
  bookedSlotText: {
    color: "#888",
  },
  selectedSlotText: {
    color: "#fff",
    fontWeight: "bold",
  },
  bookedIcon: {
    position: "absolute",
    top: 5,
    right: 5,
  },
  slotLabel: {
    position: "absolute",
    bottom: 5,
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "85%",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 85, 85, 0.3)",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 20,
  },
  endTimeSlotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -5,
  },
  endTimeSlot: {
    width: "31%",
    margin: "1%",
    height: 50,
    backgroundColor: "#222",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  endTimeSlotText: {
    color: "#fff",
    fontSize: 14,
  },
  noSlotsContainer: {
    alignItems: "center",
    padding: 20,
  },
  noSlotsText: {
    color: "#ff5555",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "center",
  },
  noSlotsSubtext: {
    color: "#aaa",
    fontSize: 14,
    marginTop: 5,
    textAlign: "center",
  },
  summaryContainer: {
    marginBottom: 100,
  },
  summaryGradient: {
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 85, 85, 0.3)",
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  summaryLabel: {
    width: 80,
    color: "#aaa",
    fontSize: 14,
  },
  summaryValue: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(17, 17, 17, 0.9)",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 85, 85, 0.3)",
    padding: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
  },
  confirmButton: {
    marginHorizontal: 20,
  },
})

export default BookingScreen

