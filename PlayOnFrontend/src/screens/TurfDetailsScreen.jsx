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
    return <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />;
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
      <Button
        title="Book Now"  
        onPress={() => navigation.navigate("Booking", { turfId: turf._id })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 50 : StatusBar.currentHeight, // Adjust for notch
  },
  image: { width: "100%", height: 200, borderRadius: 10 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  location: { fontSize: 16, color: "gray", marginBottom: 10 },
  error: { color: "red", fontSize: 18, textAlign: "center", marginTop: 20 },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
});

export default TurfDetailsScreen;
