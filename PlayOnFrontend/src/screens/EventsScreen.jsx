import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getAllEvents } from "../api/eventApi";

const EventsScreen = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    async function fetchEvents() {
      const data = await getAllEvents();
      setEvents(data);
    }
    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Events</Text>
      <FlatList
        data={events}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text style={styles.eventText}>{item.name}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000", // Black background
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ff0000", // Red text
  },
  eventText: {
    fontSize: 18,
    color: "#ff4444", // Lighter red text for event names
    marginVertical: 5,
  },
});

export default EventsScreen;