import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

const TurfCard = ({ turf, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={() => onPress(turf)} activeOpacity={0.9}>
      <View style={styles.card}>
        <Image source={{ uri: turf.image }} style={styles.image} />
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.gradient} />
        <View style={styles.infoContainer}>
          <View style={styles.info}>
            <Text style={styles.name}>{turf.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color="#ff5555" />
              <Text style={styles.location}>{turf.location}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{turf.pricePerHour}</Text>
              <Text style={styles.perHour}>/hr</Text>
            </View>
          </View>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{turf.rating || 4.5}</Text>
            <Ionicons name="star" size={12} color="#FFD700" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    shadowColor: "#ff0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 0, 0, 0.3)",
  },
  image: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  infoContainer: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: "#bbb",
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  price: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ff5555",
  },
  perHour: {
    fontSize: 14,
    color: "#aaa",
    marginLeft: 2,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFD700",
    marginRight: 2,
  },
})

export default TurfCard

