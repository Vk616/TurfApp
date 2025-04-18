"use client"

import { useState, useContext } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { ThemeContext } from "../context/ThemeContext"

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
  const { theme, darkMode } = useContext(ThemeContext)
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
      style={[
        styles.notificationItem,
        { backgroundColor: theme.cardBackground, borderColor: theme.border },
        !item.read && { backgroundColor: theme.overlay, borderColor: theme.primary },
      ]}
      onPress={() => markAsRead(item.id)}
    >
      <View style={[styles.iconContainer, { backgroundColor: getIconBackground(item.type) }]}>
        <Ionicons name={getNotificationIcon(item.type)} size={22} color={theme.text} />
      </View>

      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={[styles.notificationTitle, { color: theme.text }]}>{item.title}</Text>
          <Text style={[styles.notificationTime, { color: theme.placeholder }]}>{item.time}</Text>
        </View>
        <Text style={[styles.notificationMessage, { color: theme.placeholder }]}>{item.message}</Text>
      </View>

      {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
    </TouchableOpacity>
  )

  const getIconBackground = (type) => {
    switch (type) {
      case "booking":
        return theme.danger
      case "promo":
        return theme.accent
      case "reminder":
        return theme.info
      case "system":
        return theme.warning
      default:
        return theme.secondary
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <LinearGradient
        colors={[theme.headerBackground, theme.background]}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
        {unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
            <Text style={[styles.unreadBadgeText, { color: theme.text }]}>{unreadCount} new</Text>
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
              <Text style={[styles.actionButtonText, { color: theme.primary }]}>Mark all as read</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: theme.overlay, borderRadius: 8 }]}
              onPress={clearAllNotifications}
            >
              <Text style={[styles.actionButtonText, { color: theme.primary }]}>Clear all</Text>
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
          <Ionicons name="notifications-off-outline" size={80} color={theme.primary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No notifications</Text>
          <Text style={[styles.emptySubtext, { color: theme.placeholder }]}>You're all caught up!</Text>
        </View>
      )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  unreadBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  unreadBadgeText: {
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
  actionButtonText: {
    fontSize: 14,
  },
  notificationsList: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: "row",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    position: "relative",
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
  },
  notificationTime: {
    fontSize: 12,
  },
  notificationMessage: {
    fontSize: 14,
    lineHeight: 20,
  },
  unreadDot: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    marginTop: 20,
    fontWeight: "bold",
  },
  emptySubtext: {
    fontSize: 16,
    marginTop: 10,
  },
})

export default NotificationsScreen

