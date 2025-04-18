"use client"

import { useEffect, useState, useContext, useRef } from "react"
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
  Alert,
  FlatList,
} from "react-native"
import { getTurfById } from "../api/turfApi"
import Button from "../components/Button"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { ThemeContext } from "../context/ThemeContext"
import { AuthContext } from "../context/AuthContext"

const { width } = Dimensions.get("window")

const TurfDetailsScreen = ({ route, navigation }) => {
  const { theme, darkMode } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { turfId } = route.params || {}
  const [turf, setTurf] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isOwner, setIsOwner] = useState(false)
  const flatListRef = useRef(null)

  useEffect(() => {
    async function fetchTurf() {
      try {
        const data = await getTurfById(turfId)
        setTurf(data)
        // Check if the current user is the owner of this turf
        if (user && data.owner && user._id === data.owner) {
          setIsOwner(true)
        }
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
  }, [turfId, user])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (turfId) {
        setLoading(true)
        getTurfById(turfId)
          .then(data => {
            setTurf(data)
            // Recheck ownership
            if (user && data.owner && user._id === data.owner) {
              setIsOwner(true)
            }
          })
          .catch(err => {
            console.error("Error refreshing turf details:", err)
          })
          .finally(() => setLoading(false))
      }
    });

    return unsubscribe;
  }, [navigation, turfId, user])

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

  const allImages = [
    turf.image, 
    ...(turf.images && turf.images.length > 0 ? turf.images : [])
  ].filter(Boolean)

  if (allImages.length === 0) {
    allImages.push(
      "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?q=80&w=1000",
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?q=80&w=1000",
      "https://images.unsplash.com/photo-1624880357913-a8539238245b?q=80&w=1000"
    )
  }

  const handleEditPress = () => {
    if (isOwner || user?.role === 'admin') {
      navigation.navigate("TurfEdit", { turf })
    } else {
      Alert.alert("Not Authorized", "Only turf owners can edit turf details.")
    }
  }

  const renderAmenities = () => {
    const amenityIcons = {
      water: "water-outline",
      parking: "car-outline",
      floodlights: "flash-outline",
      changingRoom: "shirt-outline",
      beverages: "cafe-outline",
      equipment: "football-outline"
    }
    
    const amenitiesArray = turf.amenities 
      ? Object.entries(turf.amenities)
          .filter(([_, value]) => value === true)
          .map(([key]) => ({
            name: key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1'),
            icon: amenityIcons[key] || "checkmark-circle-outline"
          }))
      : []
    
    const customAmenitiesArray = turf.customAmenities && turf.customAmenities.length > 0
      ? turf.customAmenities
          .filter(amenity => amenity.available)
          .map(amenity => ({
            name: amenity.name,
            icon: amenity.icon || "star-outline"
          }))
      : []
    
    const allAmenities = [...amenitiesArray, ...customAmenitiesArray]
    
    return (
      <View style={styles.amenitiesContainer}>
        {allAmenities.map((amenity, index) => (
          <View key={index} style={styles.amenityItem}>
            <Ionicons name={amenity.icon} size={24} color={theme.primary} />
            <Text style={[styles.amenityText, { color: theme.placeholder }]}>{amenity.name}</Text>
          </View>
        ))}
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FlatList
            ref={flatListRef}
            data={allImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, index) => index.toString()}
            onMomentumScrollEnd={(e) => {
              const contentOffset = e.nativeEvent.contentOffset;
              const viewSize = e.nativeEvent.layoutMeasurement;
              const newIndex = Math.floor(contentOffset.x / viewSize.width);
              setSelectedImage(newIndex);
            }}
            renderItem={({ item }) => (
              <View style={styles.imageWrapper}>
                <Image source={{ uri: item }} style={styles.mainImage} />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.imageGradient} />
              </View>
            )}
          />
          
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>

          {(isOwner || user?.role === 'admin') && (
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
              <Ionicons name="create-outline" size={24} color="#fff" />
            </TouchableOpacity>
          )}

          {allImages.length > 1 && (
            <>
              <TouchableOpacity 
                style={[styles.navArrow, styles.leftArrow]}
                onPress={() => {
                  if (selectedImage > 0) {
                    setSelectedImage(selectedImage - 1);
                    flatListRef.current?.scrollToIndex({
                      index: selectedImage - 1,
                      animated: true
                    });
                  }
                }}
              >
                <Ionicons name="chevron-back" size={24} color="#fff" />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.navArrow, styles.rightArrow]}
                onPress={() => {
                  if (selectedImage < allImages.length - 1) {
                    setSelectedImage(selectedImage + 1);
                    flatListRef.current?.scrollToIndex({
                      index: selectedImage + 1,
                      animated: true
                    });
                  }
                }}
              >
                <Ionicons name="chevron-forward" size={24} color="#fff" />
              </TouchableOpacity>
            </>
          )}

          <View style={styles.imageIndicators}>
            {allImages.map((_, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.indicator, selectedImage === index && styles.activeIndicator]}
                onPress={() => {
                  setSelectedImage(index);
                  flatListRef.current?.scrollToIndex({
                    index: index,
                    animated: true
                  });
                }}
              />
            ))}
          </View>
        </View>

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
            {renderAmenities()}
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
  imageWrapper: {
    width: Dimensions.get('window').width,
    height: 300,
  },
  mainImage: {
    width: "100%",
    height: 300,
    resizeMode: 'cover',
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
  editButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : 30,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  navArrow: {
    position: "absolute",
    top: '50%',
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -20,
    zIndex: 10,
  },
  leftArrow: {
    left: 10,
  },
  rightArrow: {
    right: 10,
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

