"use client"

import { useEffect, useState, useContext } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from "react-native"
import { AuthContext } from "../context/AuthContext"
import { ThemeContext } from "../context/ThemeContext"
import { getAllUsers, getAllBookings, getAllTurfs, getDashboardStats, updateBookingStatus, deleteBooking, deleteUser } from "../api/adminApi"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const AdminDashboardScreen = () => {
  const { theme, darkMode } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [turfs, setTurfs] = useState([])
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const [userData, bookingData, turfData, statsData] = await Promise.all([
          getAllUsers(user.token),
          getAllBookings(user.token),
          getAllTurfs(user.token),
          getDashboardStats(user.token)
        ])
        
        setUsers(userData)
        setBookings(bookingData)
        setTurfs(turfData)
        setDashboardStats(statsData)
      } catch (error) {
        console.error("Error loading admin data:", error)
        Alert.alert("Error", "Failed to load admin data. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  
  const handleBookingStatusUpdate = async (bookingId, status) => {
    try {
      await updateBookingStatus(bookingId, status, user.token)
      // Refresh bookings after update
      const updatedBookings = await getAllBookings(user.token)
      setBookings(updatedBookings)
      Alert.alert("Success", `Booking status updated to ${status}`)
    } catch (error) {
      console.error("Error updating booking:", error)
      Alert.alert("Error", "Failed to update booking status")
    }
  }
  
  const handleBookingDelete = async (bookingId) => {
    try {
      await deleteBooking(bookingId, user.token)
      // Remove booking from state
      setBookings(bookings.filter(booking => booking._id !== bookingId))
      Alert.alert("Success", "Booking deleted successfully")
    } catch (error) {
      console.error("Error deleting booking:", error)
      Alert.alert("Error", "Failed to delete booking")
    }
  }
  
  const handleUserDelete = async (userId) => {
    try {
      await deleteUser(userId, user.token)
      // Remove user from state
      setUsers(users.filter(user => user._id !== userId))
      Alert.alert("Success", "User deleted successfully")
    } catch (error) {
      console.error("Error deleting user:", error)
      Alert.alert("Error", "Failed to delete user")
    }
  }

  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <LinearGradient colors={["#ff3333", "#cc0000"]} style={styles.statIconContainer}>
            <Ionicons name="people" size={24} color="#fff" />
          </LinearGradient>
          <Text style={[styles.statValue, { color: theme.text }]}>{dashboardStats?.stats?.userCount || users.length}</Text>
          <Text style={[styles.statLabel, { color: theme.placeholder }]}>Total Users</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={["#3366ff", "#0033cc"]} style={styles.statIconContainer}>
            <Ionicons name="calendar" size={24} color="#fff" />
          </LinearGradient>
          <Text style={[styles.statValue, { color: theme.text }]}>{dashboardStats?.stats?.bookingCount || bookings.length}</Text>
          <Text style={[styles.statLabel, { color: theme.placeholder }]}>Bookings</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <LinearGradient colors={["#33cc33", "#009900"]} style={styles.statIconContainer}>
            <Ionicons name="football" size={24} color="#fff" />
          </LinearGradient>
          <Text style={[styles.statValue, { color: theme.text }]}>{dashboardStats?.stats?.turfCount || turfs.length}</Text>
          <Text style={[styles.statLabel, { color: theme.placeholder }]}>Turfs</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={["#ff9933", "#cc6600"]} style={styles.statIconContainer}>
            <Ionicons name="cash" size={24} color="#fff" />
          </LinearGradient>
          <Text style={[styles.statValue, { color: theme.text }]}>
            ₹{Math.round(dashboardStats?.stats?.totalRevenue || 0).toLocaleString()}
          </Text>
          <Text style={[styles.statLabel, { color: theme.placeholder }]}>Revenue</Text>
        </View>
      </View>

      <View style={styles.recentActivityContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Activity</Text>

        {(dashboardStats?.recentActivity || bookings).slice(0, 5).map((booking, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Ionicons name="football-outline" size={20} color="#ff5555" />
            </View>
            <View style={styles.activityContent}>
              <Text style={[styles.activityTitle, { color: theme.text }]}>New Booking</Text>
              <Text style={[styles.activitySubtitle, { color: theme.placeholder }]}>
                {booking.turf?.name || "Unknown Turf"} - {booking.date}
              </Text>
            </View>
            <Text style={[styles.activityTime, { color: theme.placeholder }]}>
              {new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )

  const renderUsers = () => (
    <View style={styles.usersContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>All Users</Text>

      {users.map((userItem, index) => (
        <View key={index} style={styles.userCard}>
          <View style={styles.userIconContainer}>
            <Text style={styles.userInitial}>{userItem.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: theme.text }]}>{userItem.name}</Text>
            <Text style={[styles.userEmail, { color: theme.placeholder }]}>{userItem.email}</Text>
            <Text style={[styles.userRole, { color: theme.primary }]}>{userItem.role}</Text>
          </View>
          <TouchableOpacity 
            style={styles.userActionButton}
            onPress={() => {
              if (userItem.role !== 'admin') {
                Alert.alert(
                  "Delete User",
                  `Are you sure you want to delete ${userItem.name}?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => handleUserDelete(userItem._id) }
                  ]
                )
              } else {
                Alert.alert("Cannot Delete", "Admin users cannot be deleted")
              }
            }}
          >
            <Ionicons name="trash-outline" size={20} color="#ff5555" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )

  const renderBookings = () => (
    <View style={styles.bookingsContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>All Bookings</Text>

      {bookings.map((booking, index) => (
        <View key={index} style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={[styles.bookingId, { color: theme.placeholder }]}>#{booking._id.substring(0, 8)}</Text>
            <View style={styles.bookingStatus}>
              <View
                style={[styles.statusDot, { 
                  backgroundColor: booking.status === "confirmed" ? "#33cc33" : 
                                  booking.status === "completed" ? "#3366ff" : "#ff5555" 
                }]}
              />
              <Text style={[styles.statusText, { color: theme.text }]}>{booking.status}</Text>
            </View>
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.bookingDetail}>
              <Text style={[styles.bookingDetailLabel, { color: theme.placeholder }]}>Turf:</Text>
              <Text style={[styles.bookingDetailValue, { color: theme.text }]}>{booking.turf?.name || "Unknown"}</Text>
            </View>

            <View style={styles.bookingDetail}>
              <Text style={[styles.bookingDetailLabel, { color: theme.placeholder }]}>Date:</Text>
              <Text style={[styles.bookingDetailValue, { color: theme.text }]}>{booking.date}</Text>
            </View>

            <View style={styles.bookingDetail}>
              <Text style={[styles.bookingDetailLabel, { color: theme.placeholder }]}>Time:</Text>
              <Text style={[styles.bookingDetailValue, { color: theme.text }]}>{booking.timeSlot}</Text>
            </View>

            <View style={styles.bookingDetail}>
              <Text style={[styles.bookingDetailLabel, { color: theme.placeholder }]}>User:</Text>
              <Text style={[styles.bookingDetailValue, { color: theme.text }]}>{booking.user?.name || "Unknown"}</Text>
            </View>
          </View>

          <View style={styles.bookingActions}>
            <TouchableOpacity 
              style={styles.bookingActionButton}
              onPress={() => {
                Alert.alert(
                  "Update Status",
                  "Change booking status to:",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Confirmed", onPress: () => handleBookingStatusUpdate(booking._id, "confirmed") },
                    { text: "Completed", onPress: () => handleBookingStatusUpdate(booking._id, "completed") },
                    { text: "Cancelled", style: "destructive", onPress: () => handleBookingStatusUpdate(booking._id, "cancelled") }
                  ]
                )
              }}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.bookingActionText}>Status</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.bookingActionButton, styles.cancelButton]}
              onPress={() => {
                Alert.alert(
                  "Delete Booking",
                  "Are you sure you want to delete this booking?",
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Delete", style: "destructive", onPress: () => handleBookingDelete(booking._id) }
                  ]
                )
              }}
            >
              <Ionicons name="trash-outline" size={18} color="#fff" />
              <Text style={styles.bookingActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  )
  
  const renderTurfs = () => (
    <View style={styles.turfsContainer}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>All Turfs</Text>
      
      {turfs.map((turf, index) => (
        <View key={index} style={styles.turfCard}>
          <View style={styles.turfHeader}>
            <Text style={[styles.turfName, { color: theme.text }]}>{turf.name}</Text>
            <Text style={[styles.turfPrice, { color: theme.primary }]}>₹{turf.pricePerHour}/hour</Text>
          </View>
          
          <View style={styles.turfDetails}>
            <View style={styles.turfDetail}>
              <Text style={[styles.turfDetailLabel, { color: theme.placeholder }]}>Location:</Text>
              <Text style={[styles.turfDetailValue, { color: theme.text }]} numberOfLines={2}>{turf.location}</Text>
            </View>
            
            <View style={styles.turfDetail}>
              <Text style={[styles.turfDetailLabel, { color: theme.placeholder }]}>Owner:</Text>
              <Text style={[styles.turfDetailValue, { color: theme.text }]}>{turf.owner?.name || "Unknown"}</Text>
            </View>
            
            <View style={styles.turfDetail}>
              <Text style={[styles.turfDetailLabel, { color: theme.placeholder }]}>Availability:</Text>
              <Text style={[styles.turfDetailValue, { color: theme.text }]}>
                {turf.availability ? `${turf.availability.length} time slots` : "No slots"}
              </Text>
            </View>
          </View>
          
          <View style={styles.bookingActions}>
            <TouchableOpacity 
              style={styles.bookingActionButton}
              onPress={() => {
                // This would navigate to a turf edit screen in a full implementation
                Alert.alert("Edit Turf", "This feature will be available soon")
              }}
            >
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.bookingActionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.bookingActionButton, {backgroundColor: "#3366ff"}]}
              onPress={() => {
                // This would navigate to availability management in a full implementation
                Alert.alert("Manage Availability", "This feature will be available soon")
              }}
            >
              <Ionicons name="time-outline" size={18} color="#fff" />
              <Text style={styles.bookingActionText}>Availability</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return renderDashboard()
      case "users":
        return renderUsers()
      case "bookings":
        return renderBookings()
      case "turfs":
        return renderTurfs()
      default:
        return renderDashboard()
    }
  }

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>  
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.placeholder }]}>Loading admin dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <LinearGradient
        colors={[theme.headerBackground, theme.background]}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>Admin Dashboard</Text>
        <Text style={[styles.headerSubtitle, { color: theme.placeholder }]}>Manage your turf booking platform</Text>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dashboard" && styles.activeTab]}
          onPress={() => setActiveTab("dashboard")}
        >
          <Ionicons name="grid-outline" size={20} color={activeTab === "dashboard" ? theme.primary : theme.placeholder} />
          <Text style={[styles.tabText, activeTab === "dashboard" && styles.activeTabText, { color: activeTab === "dashboard" ? theme.primary : theme.placeholder }]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Ionicons name="people-outline" size={20} color={activeTab === "users" ? theme.primary : theme.placeholder} />
          <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText, { color: activeTab === "users" ? theme.primary : theme.placeholder }]}>Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "bookings" && styles.activeTab]}
          onPress={() => setActiveTab("bookings")}
        >
          <Ionicons name="calendar-outline" size={20} color={activeTab === "bookings" ? theme.primary : theme.placeholder} />
          <Text style={[styles.tabText, activeTab === "bookings" && styles.activeTabText, { color: activeTab === "bookings" ? theme.primary : theme.placeholder }]}>Bookings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === "turfs" && styles.activeTab]}
          onPress={() => setActiveTab("turfs")}
        >
          <Ionicons name="football-outline" size={20} color={activeTab === "turfs" ? theme.primary : theme.placeholder} />
          <Text style={[styles.tabText, activeTab === "turfs" && styles.activeTabText, { color: activeTab === "turfs" ? theme.primary : theme.placeholder }]}>Turfs</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
  },
  tabText: {
    marginLeft: 5,
    fontSize: 14,
  },
  activeTabText: {
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  // Dashboard styles
  dashboardContainer: {
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  statCard: {
    width: "48%",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
  },
  recentActivityContainer: {
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  activitySubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
  },
  // Users styles
  usersContainer: {
    marginBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
  },
  userIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userInitial: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  userActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  // Booking styles
  bookingsContainer: {
    marginBottom: 20,
  },
  bookingCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  bookingId: {
    fontSize: 14,
  },
  bookingStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  statusText: {
    fontSize: 12,
    textTransform: "uppercase",
  },
  bookingDetails: {
    marginBottom: 15,
  },
  bookingDetail: {
    flexDirection: "row",
    marginBottom: 8,
  },
  bookingDetailLabel: {
    width: 60,
    fontSize: 14,
  },
  bookingDetailValue: {
    flex: 1,
    fontSize: 14,
  },
  bookingActions: {
    flexDirection: "row",
  },
  bookingActionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "rgba(255, 85, 85, 0.2)",
  },
  bookingActionText: {
    fontSize: 12,
    marginLeft: 5,
  },
  // Turf styles
  turfsContainer: {
    marginBottom: 20,
  },
  turfCard: {
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  turfHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  turfName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  turfPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  turfDetails: {
    marginBottom: 15,
  },
  turfDetail: {
    flexDirection: "row",
    marginBottom: 8,
  },
  turfDetailLabel: {
    width: 80,
    fontSize: 14,
  },
  turfDetailValue: {
    flex: 1,
    fontSize: 14,
  },
})

export default AdminDashboardScreen

