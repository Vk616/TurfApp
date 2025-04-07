"use client"

import { useEffect, useState, useContext } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from "react-native"
import { AuthContext } from "../context/AuthContext"
import { getAllUsers, getAllBookings } from "../api/adminApi"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const AdminDashboardScreen = () => {
  const { user } = useContext(AuthContext)
  const [users, setUsers] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("dashboard")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        const userData = await getAllUsers(user.token)
        const bookingData = await getAllBookings(user.token)
        setUsers(userData)
        setBookings(bookingData)
      } catch (error) {
        console.error("Error loading admin data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const renderDashboard = () => (
    <View style={styles.dashboardContainer}>
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <LinearGradient colors={["#ff3333", "#cc0000"]} style={styles.statIconContainer}>
            <Ionicons name="people" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.statValue}>{users.length}</Text>
          <Text style={styles.statLabel}>Total Users</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={["#3366ff", "#0033cc"]} style={styles.statIconContainer}>
            <Ionicons name="calendar" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.statValue}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Bookings</Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <LinearGradient colors={["#33cc33", "#009900"]} style={styles.statIconContainer}>
            <Ionicons name="football" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.statValue}>12</Text>
          <Text style={styles.statLabel}>Turfs</Text>
        </View>

        <View style={styles.statCard}>
          <LinearGradient colors={["#ff9933", "#cc6600"]} style={styles.statIconContainer}>
            <Ionicons name="cash" size={24} color="#fff" />
          </LinearGradient>
          <Text style={styles.statValue}>₹{(bookings.length * 500).toLocaleString()}</Text>
          <Text style={styles.statLabel}>Revenue</Text>
        </View>
      </View>

      <View style={styles.recentActivityContainer}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>

        {bookings.slice(0, 5).map((booking, index) => (
          <View key={index} style={styles.activityItem}>
            <View style={styles.activityIconContainer}>
              <Ionicons name="football-outline" size={20} color="#ff5555" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New Booking</Text>
              <Text style={styles.activitySubtitle}>
                {booking.turf?.name || "Unknown Turf"} - {booking.date}
              </Text>
            </View>
            <Text style={styles.activityTime}>
              {new Date(booking.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        ))}
      </View>
    </View>
  )

  const renderUsers = () => (
    <View style={styles.usersContainer}>
      <Text style={styles.sectionTitle}>All Users</Text>

      {users.map((user, index) => (
        <View key={index} style={styles.userCard}>
          <View style={styles.userIconContainer}>
            <Text style={styles.userInitial}>{user.name.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userRole}>{user.role}</Text>
          </View>
          <TouchableOpacity style={styles.userActionButton}>
            <Ionicons name="ellipsis-vertical" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  )

  const renderBookings = () => (
    <View style={styles.bookingsContainer}>
      <Text style={styles.sectionTitle}>All Bookings</Text>

      {bookings.map((booking, index) => (
        <View key={index} style={styles.bookingCard}>
          <View style={styles.bookingHeader}>
            <Text style={styles.bookingId}>#{booking._id.substring(0, 8)}</Text>
            <View style={styles.bookingStatus}>
              <View
                style={[styles.statusDot, { backgroundColor: booking.status === "confirmed" ? "#33cc33" : "#ff5555" }]}
              />
              <Text style={styles.statusText}>{booking.status}</Text>
            </View>
          </View>

          <View style={styles.bookingDetails}>
            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Turf:</Text>
              <Text style={styles.bookingDetailValue}>{booking.turf?.name || "Unknown"}</Text>
            </View>

            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Date:</Text>
              <Text style={styles.bookingDetailValue}>{booking.date}</Text>
            </View>

            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>Time:</Text>
              <Text style={styles.bookingDetailValue}>{booking.timeSlot}</Text>
            </View>

            <View style={styles.bookingDetail}>
              <Text style={styles.bookingDetailLabel}>User:</Text>
              <Text style={styles.bookingDetailValue}>{booking.user?.name || "Unknown"}</Text>
            </View>
          </View>

          <View style={styles.bookingActions}>
            <TouchableOpacity style={styles.bookingActionButton}>
              <Ionicons name="create-outline" size={18} color="#fff" />
              <Text style={styles.bookingActionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.bookingActionButton, styles.cancelButton]}>
              <Ionicons name="close-circle-outline" size={18} color="#fff" />
              <Text style={styles.bookingActionText}>Cancel</Text>
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
      default:
        return renderDashboard()
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#ff5555" />
        <Text style={styles.loadingText}>Loading admin dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#111", "#000"]} style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.headerSubtitle}>Manage your turf booking platform</Text>
      </LinearGradient>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dashboard" && styles.activeTab]}
          onPress={() => setActiveTab("dashboard")}
        >
          <Ionicons name="grid-outline" size={20} color={activeTab === "dashboard" ? "#ff5555" : "#aaa"} />
          <Text style={[styles.tabText, activeTab === "dashboard" && styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "users" && styles.activeTab]}
          onPress={() => setActiveTab("users")}
        >
          <Ionicons name="people-outline" size={20} color={activeTab === "users" ? "#ff5555" : "#aaa"} />
          <Text style={[styles.tabText, activeTab === "users" && styles.activeTabText]}>Users</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === "bookings" && styles.activeTab]}
          onPress={() => setActiveTab("bookings")}
        >
          <Ionicons name="calendar-outline" size={20} color={activeTab === "bookings" ? "#ff5555" : "#aaa"} />
          <Text style={[styles.tabText, activeTab === "bookings" && styles.activeTabText]}>Bookings</Text>
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
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  loadingText: {
    color: "#aaa",
    marginTop: 10,
    fontSize: 16,
  },
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: "#111",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 85, 85, 0.3)",
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
    borderBottomColor: "#ff5555",
  },
  tabText: {
    color: "#aaa",
    marginLeft: 5,
    fontSize: 14,
  },
  activeTabText: {
    color: "#ff5555",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
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
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
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
    color: "#fff",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#aaa",
  },
  recentActivityContainer: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 85, 85, 0.1)",
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
    color: "#fff",
  },
  activitySubtitle: {
    fontSize: 12,
    color: "#aaa",
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#aaa",
  },
  usersContainer: {
    marginBottom: 20,
  },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  userIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255, 85, 85, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  userInitial: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff5555",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: "#ff5555",
    textTransform: "uppercase",
  },
  userActionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
  },
  bookingsContainer: {
    marginBottom: 20,
  },
  bookingCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  bookingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  bookingId: {
    fontSize: 14,
    color: "#aaa",
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
    color: "#fff",
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
    color: "#aaa",
  },
  bookingDetailValue: {
    flex: 1,
    fontSize: 14,
    color: "#fff",
  },
  bookingActions: {
    flexDirection: "row",
  },
  bookingActionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#333",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  cancelButton: {
    backgroundColor: "rgba(255, 85, 85, 0.2)",
  },
  bookingActionText: {
    color: "#fff",
    fontSize: 12,
    marginLeft: 5,
  },
})

export default AdminDashboardScreen

