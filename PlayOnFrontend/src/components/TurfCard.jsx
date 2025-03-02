import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const TurfCard = ({ turf, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress(turf)}>
      <Image source={{ uri: turf.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{turf.name}</Text>
        <Text style={styles.location}>{turf.location}</Text>
        <Text style={styles.price}>₹{turf.pricePerHour}/hr</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#222", // Dark background to match HomeScreen
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#ff0000", // Red outline
  },
  image: {
    width: "100%",
    height: 150,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff", // White text for better contrast
  },
  location: {
    fontSize: 14,
    color: "#bbb", // Grey text for readability
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#f5a623", // Light orange for price contrast
  },
});

export default TurfCard;
