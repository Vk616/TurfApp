"use client"

import { useEffect, useState, useContext } from "react"
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Platform,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native"
import { getTurfById } from "../api/turfApi"
import Button from "../components/Button"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { ThemeContext } from "../context/ThemeContext"

const { width } = Dimensions.get("window")

const TurfDetailsScreen = ({ route, navigation }) => {
  const { theme, darkMode } = useContext(ThemeContext)
  const { turfId } = route.params || {}
  const [turf, setTurf] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock additional images for demo purposes
  const additionalImages = [
    "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000",
    "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000",
    "https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=1000",
  ]

  useEffect(() => {
    async function fetchTurf() {
      try {
        const data = await getTurfById(turfId)
        setTurf(data)
      } catch (err) {
        console.error("Error fetching turf details:", err)
        setError("Failed to load turf details.")
      } finally {
        setLoading(false)
      }
    }
    if (turfId) {
      fetchTurf()
    } else {
      setError("Invalid Turf ID")
      setLoading(false)
    }
  }, [turfId])

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loaderText, { color: theme.primary }]}>Loading turf details...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={60} color={theme.primary} />
        <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
      </View>
    )
  }

  if (!turf) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="alert-circle-outline" size={60} color={theme.primary} />
        <Text style={[styles.error, { color: theme.error }]}>Turf details not available.</Text>
      </View>
    )
  }

  const allImages = [turf.image, ...additionalImages]

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Main Image with Gradient Overlay */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: allImages[selectedImage] }} style={styles.mainImage} />
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.imageGradient} />
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.imageIndicators}>
            {allImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.indicator, selectedImage === index && styles.activeIndicator]}
                onPress={() => setSelectedImage(index)}
              />
            ))}
          </View>
        </View>

        {/* Turf Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={[styles.name, { color: theme.text }]}>{turf.name}</Text>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color={theme.primary} />
                <Text style={[styles.location, { color: theme.placeholder }]}>{turf.location}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.priceCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View>
              <Text style={[styles.priceLabel, { color: theme.placeholder }]}>Price per hour</Text>
              <Text style={[styles.price, { color: theme.primary }]}>₹{turf.pricePerHour}</Text>
            </View>
            <Button
              title="Book Now"
              onPress={() => navigation.navigate("Booking", { turfId: turf._id })}
              style={styles.bookButton}
              icon={<Ionicons name="calendar-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Description</Text>
            <Text style={[styles.description, { color: theme.placeholder }]}>
              {turf.description ||
                "Experience the ultimate playing surface at our premium turf. Perfect for football, cricket, and other sports. State-of-the-art facilities with floodlights for evening games."}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              <View style={styles.amenityItem}>
                <Ionicons name="water-outline" size={24} color={theme.primary} />
                <Text style={[styles.amenityText, { color: theme.placeholder }]}>Water</Text>
              </View>
              <View style={styles.amenityItem}>
                <Ionicons name="car-outline" size={24} color={theme.primary} />
                <Text style={[styles.amenityText, { color: theme.placeholder }]}>Parking</Text>
              </View>
              <View style={styles.amenityItem}>
                <Ionicons name="flash-outline" size={24} color={theme.primary} />
                <Text style={[styles.amenityText, { color: theme.placeholder }]}>Floodlights</Text>
              </View>
              <View style={styles.amenityItem}>
                <Ionicons name="shirt-outline" size={24} color={theme.primary} />
                <Text style={[styles.amenityText, { color: theme.placeholder }]}>Changing Room</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Location</Text>
            <View style={[styles.mapPlaceholder, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <Ionicons name="map-outline" size={30} color={theme.primary} />
              <Text style={[styles.mapText, { color: theme.placeholder }]}>Map View</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { backgroundColor: theme.cardBackground, borderTopColor: theme.border }]}>
        <View>
          <Text style={[styles.bottomPrice, { color: theme.primary }]}>₹{turf.pricePerHour}</Text>
          <Text style={[styles.bottomPriceLabel, { color: theme.placeholder }]}>per hour</Text>
        </View>
        <Button
          title="Book Now"
          onPress={() => navigation.navigate("Booking", { turfId: turf._id })}
          style={styles.bottomButton}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  error: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  imageContainer: {
    position: "relative",
    height: 300,
  },
  mainImage: {
    width: "100%",
    height: 300,
  },
  imageGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  imageIndicators: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#fff",
    width: 20,
  },
  detailsContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  location: {
    fontSize: 16,
    marginLeft: 5,
  },
  priceCard: {
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
  },
  priceLabel: {
    fontSize: 14,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
  },
  bookButton: {
    width: 150,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    lineHeight: 22,
  },
  amenitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenityItem: {
    width: "50%",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  amenityText: {
    marginLeft: 10,
  },
  mapPlaceholder: {
    height: 150,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },
  mapText: {
    marginTop: 5,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === "ios" ? 30 : 15,
    borderTopWidth: 1,
  },
  bottomPrice: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bottomPriceLabel: {
    fontSize: 12,
  },
  bottomButton: {
    width: 150,
  },
})

export default TurfDetailsScreen

