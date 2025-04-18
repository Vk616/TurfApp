"use client"

import { useEffect, useState, useContext } from "react"
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image, StatusBar, ActivityIndicator } from "react-native"
import { getAllEvents } from "../api/eventApi"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { ThemeContext } from '../context/ThemeContext'

// Mock event images for demo purposes
const eventImages = [
  "https://images.unsplash.com/photo-1547347298-4074fc3086f0?q=80&w=1000",
  "https://images.unsplash.com/photo-1459865264687-595d652de67e?q=80&w=1000",
  "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000",
  "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?q=80&w=1000",
]

const EventsScreen = ({ navigation }) => {
  const { theme, darkMode } = useContext(ThemeContext)
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
    <TouchableOpacity
      style={[styles.eventCard, { backgroundColor: theme.cardBackground, borderColor: theme.border, shadowColor: theme.shadow }]}
      activeOpacity={0.9}
      onPress={() => navigation.navigate('EventDetails', { eventId: item._id })}
    >
      <Image source={{ uri: item.image }} style={styles.eventImage} />
      <LinearGradient
        colors={['transparent', theme.cardBackground + 'AA']}
        style={styles.eventGradient}
      />

      <View style={styles.eventContent}>
        <View style={[styles.eventBadge, { backgroundColor: theme.primary }]}>  
          <Text style={[styles.eventBadgeText, { color: theme.text }]}>{item.time}</Text>
        </View>

        <Text style={[styles.eventTitle, { color: theme.text }]}>{item.name}</Text>

        <View style={styles.eventDetails}>
          <View style={styles.eventDetailItem}>
            <Ionicons name="calendar-outline" size={16} color={theme.primary} />
            <Text style={[styles.eventDetailText, { color: theme.placeholder }]}>{formatDate(item.date)}</Text>
          </View>

          <View style={styles.eventDetailItem}>
            <Ionicons name="location-outline" size={16} color={theme.primary} />
            <Text style={[styles.eventDetailText, { color: theme.placeholder }]}>{item.location}</Text>
          </View>

          <View style={styles.eventDetailItem}>
            <Ionicons name="people-outline" size={16} color={theme.primary} />
            <Text style={[styles.eventDetailText, { color: theme.placeholder }]}>{item.participants} participants</Text>
          </View>
        </View>

        <TouchableOpacity style={[styles.registerButton, { borderColor: theme.primary }]}>  
          <Text style={[styles.registerButtonText, { color: theme.primary }]}>Register Now</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  if (loading && !refreshing) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.placeholder }]}>Loading events...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <LinearGradient colors={[theme.headerBackground, theme.background]} style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Upcoming Events</Text>
        <Text style={[styles.headerSubtitle, { color: theme.placeholder }]}>Join tournaments and football events</Text>
      </LinearGradient>

      {events.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="calendar-outline" size={80} color={theme.primary} />
          <Text style={[styles.emptyText, { color: theme.text }]}>No upcoming events</Text>
          <Text style={[styles.emptySubtext, { color: theme.placeholder }]}>Check back later for new events</Text>
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
    textAlign: "center",
  },
  eventsList: {
    padding: 16,
  },
  eventCard: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    borderWidth: 1,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  eventBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
  },
  eventTitle: {
    fontSize: 20,
    fontWeight: "bold",
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
    marginLeft: 8,
    fontSize: 14,
  },
  registerButton: {
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  registerButtonText: {
    fontWeight: "bold",
    fontSize: 14,
  },
})

export default EventsScreen

