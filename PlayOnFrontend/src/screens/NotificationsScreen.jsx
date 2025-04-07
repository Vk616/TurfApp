"use client"

import { useState } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

// Mock notifications data
const mockNotifications = [
  {
    id: "1",
    type: "booking",
    title: "Booking Confirmed",
    message: "Your booking for Football Turf on 15th June has been confirmed.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "promo",
    title: "Weekend Offer",
    message: "Get 20% off on all bookings this weekend. Use code WEEKEND20.",
    time: "1 day ago",
    read: true,
  },
  {
    id: "3",
    type: "reminder",
    title: "Upcoming Booking",
    message: "Reminder: You have a booking tomorrow at 5:00 PM.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "4",
    type: "system",
    title: "App Update Available",
    message: "A new version of PlayOn is available. Update now for new features.",
    time: "1 week ago",
    read: true,
  },
]

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState(mockNotifications)

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case "booking":
        return "calendar"
      case "promo":
        return "pricetag"
      case "reminder":
        return "alarm"
      case "system":
        return "information-circle"
      default:
        return "notifications"
    }
  }

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.notificationItem, !item.read && styles.unreadNotification]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBackground(item.type) }]}>
        <Ionicons name={getNotificationIcon(item.type)} size={22} color="#fff" />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          <Text style={styles.notificationTime}>{item.time}</Text>
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>

      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  )

  const getIconBackground = (type) => {
    switch (type) {
      case "booking":
        return "#ff5555"
      case "promo":
        return "#33cc33"
      case "reminder":
        return "#3366ff"
      case "system":
        return "#ff9933"
      default:
        return "#888"
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#111", "#000"]} style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadBadgeText}>{unreadCount} new</Text>
          </View>
        )}
      </LinearGradient>

      {notifications.length > 0 ? (
        <>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => setNotifications(notifications.map((n) => ({ ...n, read: true })))}
            >
              <Text style={styles.actionButtonText}>Mark all as read</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.clearButton]} onPress={clearAllNotifications}>
              <Text style={styles.actionButtonText}>Clear all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={notifications}
            keyExtractor={(item) => item.id}
            renderItem={renderNotificationItem}
            contentContainerStyle={styles.notificationsList}
            showsVerticalScrollIndicator={false}
          />
        </>
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons name="notifications-off-outline" size={80} color="#ff5555" />
          <Text style={styles.emptyText}>No notifications</Text>
          <Text style={styles.emptySubtext}>You're all caught up!</Text>
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
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  unreadBadge: {
    backgroundColor: "#ff5555",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  unreadBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  clearButton: {
    backgroundColor: "rgba(255, 85, 85, 0.1)",
    borderRadius: 8,
  },
  actionButtonText: {
    color: "#ff5555",
    fontSize: 14,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
  },
  unreadNotification: {
    backgroundColor: "rgba(255, 85, 85, 0.05)",
    borderColor: "rgba(255, 85, 85, 0.3)",
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  notificationTime: {
    fontSize: 12,
    color: "#aaa",
  },
  notificationMessage: {
    fontSize: 14,
    color: "#bbb",
    lineHeight: 20,
  },
  unreadDot: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff5555",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    color: "#fff",
    marginTop: 20,
    fontWeight: "bold",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 10,
  },
})

export default NotificationsScreen

