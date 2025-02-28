import React, { useEffect, useState } from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";
import { getTurfById } from "../api/turfApi";
import Rating from "../components/Rating";

const TurfDetailsScreen = ({ route, navigation }) => {
  const { turfId } = route.params || {};
  if (!turfId) {
    return <Text>Error: Turf ID not found!</Text>;  // Handle missing turfId gracefully
  }
  const [turf, setTurf] = useState(null);

  useEffect(() => {
    async function fetchTurf() {
      try {
        const data = await getTurfById(turfId);
        setTurf(data);
      } catch (error) {
        console.error("Error fetching turf details:", error);
      }
    }
    fetchTurf();
  }, [turfId]);

  return (
    <View style={styles.container}>
      <Image source={{ uri: turf.image }} style={styles.image} />
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
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 200, borderRadius: 10 },
  name: { fontSize: 22, fontWeight: "bold", marginTop: 10 },
  location: { fontSize: 16, color: "gray", marginBottom: 10 },
});

export default TurfDetailsScreen;
