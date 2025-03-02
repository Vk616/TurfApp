import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, StyleSheet, ActivityIndicator, Platform, StatusBar } from "react-native";
import { getTurfById } from "../api/turfApi";
import Rating from "../components/Rating";

const TurfDetailsScreen = ({ route, navigation }) => {
  const { turfId } = route.params || {};
  const [turf, setTurf] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTurf() {
      try {
        const data = await getTurfById(turfId);
        setTurf(data);
      } catch (err) {
        console.error("Error fetching turf details:", err);
        setError("Failed to load turf details.");
      } finally {
        setLoading(false);
      }
    }
    if (turfId) {
      fetchTurf();
    } else {
      setError("Invalid Turf ID");
      setLoading(false);
    }
  }, [turfId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#ff0000" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  if (!turf) {
    return <Text style={styles.error}>Turf details not available.</Text>;
  }

  return (
    <View style={styles.container}>
      {turf.image && <Image source={{ uri: turf.image }} style={styles.image} />}
      <Text style={styles.name}>{turf.name}</Text>
      <Text style={styles.location}>{turf.location}</Text>
      <Rating rating={turf.rating} />
      <View style={styles.buttonContainer}>
        <Button
          title="Book Now"  
          color="#ff0000"
          onPress={() => navigation.navigate("Booking", { turfId: turf._id })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#111", // Dark background
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight, // Adjust for notch
    alignItems: "center",
  },
  image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 15 },
  name: { fontSize: 22, fontWeight: "bold", color: "#fff", marginTop: 10 },
  location: { fontSize: 16, color: "#bbb", marginBottom: 10 },
  error: { color: "#ff4444", fontSize: 18, textAlign: "center", marginTop: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonContainer: {
    marginTop: 15,
    width: "80%",
  },
});

export default TurfDetailsScreen;