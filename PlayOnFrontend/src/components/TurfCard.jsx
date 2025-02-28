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
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: 15,
    elevation: 3,
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
  },
  location: {
    fontSize: 14,
    color: "gray",
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 5,
    color: "#007bff",
  },
});

export default TurfCard;
