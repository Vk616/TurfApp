"use client"

import { useEffect, useState } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, StatusBar, ActivityIndicator } from "react-native"
import { getAllEvents } from "../api/eventApi"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

// Mock event images for demo purposes
const eventImages = [
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1000",
  "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000",
  "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000",
]

const EventsScreen = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const data = await getAllEvents()

      // Enhance events with random images for demo
      const enhancedEvents = data.map((event, index) => ({
        ...event,
        image: eventImages[index % eventImages.length],
        participants: Math.floor(Math.random() * 50) + 10,
      }))

      setEvents(enhancedEvents)
    } catch (error) {
      console.error("Error fetching events:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchEvents()
  }

  const formatDate = (dateString) => {
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const renderEventCard = ({ item }) => (
    <TouchableOpacity style={styles.eventCard} activeOpacity={0.9}>
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.eventGradient} />

      <View style={styles.eventContent}>
        <View style={styles.eventBadge}>
          <Text style={styles.eventBadgeText}>{item.time}</Text>
        </View>

        <Text style={styles.eventTitle}>{item.name}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Ionicons name="calendar-outline" size={16} color="#ff5555" />
            <Text style={styles.eventDetailText}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.eventDetailItem}>
            <Ionicons name="location-outline" size={16} color="#ff5555" />
            <Text style={styles.eventDetailText}>{item.location}</Text>
          </View>

          <View style={styles.eventDetailItem}>
            <Ionicons name="people-outline" size={16} color="#ff5555" />
            <Text style={styles.eventDetailText}>{item.participants} participants</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.registerButton}>
          <Text style={styles.registerButtonText}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#ff5555" />
        <Text style={styles.loadingText}>Loading events...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#111", "#000"]} style={styles.header}>
        <Text style={styles.headerTitle}>Upcoming Events</Text>
        <Text style={styles.headerSubtitle}>Join tournaments and football events</Text>
      </LinearGradient>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color="#ff5555" />
          <Text style={styles.emptyText}>No upcoming events</Text>
          <Text style={styles.emptySubtext}>Check back later for new events</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item._id}
          renderItem={renderEventCard}
          contentContainerStyle={styles.eventsList}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={handleRefresh}
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
    textAlign: "center",
  },
  eventsList: {
    padding: 16,
  },
  eventCard: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  eventImage: {
    width: "100%",
    height: 180,
  },
  eventGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 180,
  },
  eventContent: {
    padding: 15,
  },
  eventBadge: {
    position: "absolute",
    top: -30,
    right: 15,
    backgroundColor: "#ff5555",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  eventBadgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 10,
  },
  eventDetails: {
    marginBottom: 15,
  },
  eventDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  eventDetailText: {
    color: "#bbb",
    marginLeft: 8,
    fontSize: 14,
  },
  registerButton: {
    backgroundColor: "rgba(255, 85, 85, 0.2)",
    borderWidth: 1,
    borderColor: "#ff5555",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#ff5555",
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default EventsScreen

