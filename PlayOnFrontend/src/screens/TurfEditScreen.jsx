"use client"

import { useState, useContext, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Platform,
  StatusBar,
  ActivityIndicator,
  Switch
} from "react-native"
import * as ImagePicker from "expo-image-picker"
import { Ionicons } from "@expo/vector-icons"
import { ThemeContext } from "../context/ThemeContext"
import { AuthContext } from "../context/AuthContext"
import Button from "../components/Button"
import { updateTurf } from "../api/turfApi"
import { LinearGradient } from "expo-linear-gradient"

const TurfEditScreen = ({ route, navigation }) => {
  const { theme, darkMode } = useContext(ThemeContext)
  const { user } = useContext(AuthContext)
  const { turf } = route.params

  // Check if the current user is authorized to edit this turf
  useEffect(() => {
    // Only turf owners and admins can edit
    const isOwner = user && turf.owner && user._id === turf.owner;
    const isAdmin = user && user.role === 'admin';
    
    if (!isOwner && !isAdmin) {
      Alert.alert(
        "Access Denied", 
        "Only turf owners and administrators can edit turf details.",
        [{ text: "OK", onPress: () => navigation.goBack() }]
      );
    }
  }, [user, turf, navigation]);

  // State for turf details
  const [name, setName] = useState(turf.name || "")
  const [location, setLocation] = useState(turf.location || "")
  const [description, setDescription] = useState(turf.description || "")
  const [pricePerHour, setPricePerHour] = useState(turf.pricePerHour?.toString() || "")
  const [loading, setLoading] = useState(false)
  
  // Image states
  const [mainImage, setMainImage] = useState(turf.image || null)
  const [additionalImages, setAdditionalImages] = useState(turf.images || [])
  const [imagesToRemove, setImagesToRemove] = useState([])
  const [newImages, setNewImages] = useState([])

  // Amenities state
  const [amenities, setAmenities] = useState({
    water: turf.amenities?.water ?? true,
    parking: turf.amenities?.parking ?? true,
    floodlights: turf.amenities?.floodlights ?? true,
    changingRoom: turf.amenities?.changingRoom ?? true,
    beverages: turf.amenities?.beverages ?? false,
    equipment: turf.amenities?.equipment ?? false,
  })
  
  // Custom amenities state
  const [customAmenities, setCustomAmenities] = useState(turf.customAmenities || [])
  const [newAmenityName, setNewAmenityName] = useState("")
  const [newAmenityIcon, setNewAmenityIcon] = useState("star-outline")

  useEffect(() => {
    // Request permission for image library access
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Permission to access the image library is required!")
      }
    })()
  }, [])

  const handleImagePick = async (isMainImage = false) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      })

      if (!result.cancelled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0]
        
        // Handle based on whether it's the main image or additional image
        if (isMainImage) {
          setMainImage(selectedImage.uri)
        } else {
          setNewImages([...newImages, selectedImage.uri])
        }
      }
    } catch (error) {
      console.error("Error picking image:", error)
      Alert.alert("Error", "Failed to pick image")
    }
  }

  const handleRemoveImage = (imageUrl, isNewImage = false) => {
    if (isNewImage) {
      // Remove from new images
      setNewImages(newImages.filter(img => img !== imageUrl))
    } else {
      // Add to removal list and remove from displayed list
      setImagesToRemove([...imagesToRemove, imageUrl])
      setAdditionalImages(additionalImages.filter(img => img !== imageUrl))
    }
  }

  const handleSaveChanges = async () => {
    if (!name || !location || !pricePerHour) {
      Alert.alert("Missing Information", "Please fill in all required fields.")
      return
    }

    if (isNaN(Number(pricePerHour)) || Number(pricePerHour) <= 0) {
      Alert.alert("Invalid Price", "Please enter a valid price per hour.")
      return
    }

    setLoading(true)

    try {
      // Create FormData for multipart upload
      const formData = new FormData()
      formData.append("name", name)
      formData.append("location", location)
      formData.append("description", description)
      formData.append("pricePerHour", pricePerHour)
      
      // Include amenities
      formData.append("amenities", JSON.stringify(amenities))
      
      // Include custom amenities
      formData.append("customAmenities", JSON.stringify(customAmenities))
      
      // Include list of images to remove
      if (imagesToRemove.length > 0) {
        formData.append("removeImages", JSON.stringify(imagesToRemove))
      }
      
      // Include new main image if changed
      if (mainImage && !mainImage.startsWith("http")) {
        const filename = mainImage.split('/').pop()
        const match = /\.(\w+)$/.exec(filename)
        const type = match ? `image/${match[1]}` : 'image'
        
        formData.append("image", {
          uri: Platform.OS === "android" ? mainImage : mainImage.replace("file://", ""),
          name: filename,
          type
        })
      }
      
      // Include additional images
      if (newImages.length > 0) {
        newImages.forEach((image, index) => {
          const filename = image.split('/').pop()
          const match = /\.(\w+)$/.exec(filename)
          const type = match ? `image/${match[1]}` : 'image'
          
          formData.append("additionalImages", {
            uri: Platform.OS === "android" ? image : image.replace("file://", ""),
            name: filename,
            type
          })
        })
      }
      
      await updateTurf(user.token, turf._id, formData)
      
      Alert.alert("Success", "Turf details updated successfully", [
        {
          text: "OK",
          onPress: () => navigation.goBack()
        }
      ])
    } catch (error) {
      console.error("Error updating turf:", error)
      Alert.alert("Error", "Failed to update turf details.")
    } finally {
      setLoading(false)
    }
  }

  const handleAddCustomAmenity = () => {
    if (!newAmenityName.trim()) {
      Alert.alert("Invalid Input", "Please enter a name for the amenity.")
      return
    }
    
    const newCustomAmenity = {
      name: newAmenityName.trim(),
      icon: newAmenityIcon,
      available: true
    }
    
    setCustomAmenities([...customAmenities, newCustomAmenity])
    setNewAmenityName("")
    setNewAmenityIcon("star-outline")
  }

  const handleRemoveCustomAmenity = (index) => {
    const updatedAmenities = [...customAmenities]
    updatedAmenities.splice(index, 1)
    setCustomAmenities(updatedAmenities)
  }

  const toggleAmenity = (key) => {
    setAmenities({
      ...amenities,
      [key]: !amenities[key]
    })
  }

  const commonIconOptions = [
    { name: "Star", icon: "star-outline" },
    { name: "Food", icon: "fast-food-outline" },
    { name: "Drink", icon: "cafe-outline" },
    { name: "Wifi", icon: "wifi-outline" },
    { name: "TV", icon: "tv-outline" },
    { name: "Restaurant", icon: "restaurant-outline" },
    { name: "Medical", icon: "medical-outline" },
    { name: "Trophy", icon: "trophy-outline" },
    { name: "Card", icon: "card-outline" },
  ]

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.primary }]}>Saving changes...</Text>
      </View>
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      <LinearGradient colors={[theme.headerBackground, theme.background]} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Turf</Text>
          <View style={styles.headerRight} />
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Basic Information</Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Name*</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.border }]}
              value={name}
              onChangeText={setName}
              placeholder="Turf Name"
              placeholderTextColor={theme.placeholder}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Location*</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.border }]}
              value={location}
              onChangeText={setLocation}
              placeholder="Address"
              placeholderTextColor={theme.placeholder}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Price per Hour (₹)*</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.border }]}
              value={pricePerHour}
              onChangeText={setPricePerHour}
              keyboardType="numeric"
              placeholder="Price"
              placeholderTextColor={theme.placeholder}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: theme.text }]}>Description</Text>
            <TextInput
              style={[styles.textarea, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.border }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe your turf..."
              placeholderTextColor={theme.placeholder}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Images</Text>
          
          {/* Main Image */}
          <View style={styles.imageSection}>
            <Text style={[styles.label, { color: theme.text }]}>Main Image</Text>
            <View style={styles.mainImageContainer}>
              {mainImage ? (
                <View style={styles.mainImageWrapper}>
                  <Image source={{ uri: mainImage }} style={styles.mainImage} />
                  <TouchableOpacity
                    style={styles.changeImageButton}
                    onPress={() => handleImagePick(true)}
                  >
                    <Text style={styles.changeImageText}>Change</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.imagePicker, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
                  onPress={() => handleImagePick(true)}
                >
                  <Ionicons name="image-outline" size={40} color={theme.primary} />
                  <Text style={[styles.imagePickerText, { color: theme.text }]}>Add Main Image</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          
          {/* Additional Images */}
          <View style={styles.imageSection}>
            <Text style={[styles.label, { color: theme.text }]}>Additional Images</Text>
            <View style={styles.additionalImagesContainer}>
              {/* Existing images */}
              {additionalImages.filter(img => !imagesToRemove.includes(img)).map((imageUrl, index) => (
                <View key={`existing-${index}`} style={styles.imageWrapper}>
                  <Image source={{ uri: imageUrl }} style={styles.additionalImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(imageUrl)}
                  >
                    <Ionicons name="close-circle" size={24} color={theme.danger} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* New images */}
              {newImages.map((imageUri, index) => (
                <View key={`new-${index}`} style={styles.imageWrapper}>
                  <Image source={{ uri: imageUri }} style={styles.additionalImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(imageUri, true)}
                  >
                    <Ionicons name="close-circle" size={24} color={theme.danger} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {/* Add image button */}
              <TouchableOpacity
                style={[styles.addImageButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
                onPress={() => handleImagePick(false)}
              >
                <Ionicons name="add" size={30} color={theme.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Standard Amenities</Text>
          
          {Object.entries(amenities).map(([key, value]) => {
            const amenityIcons = {
              water: "water-outline",
              parking: "car-outline",
              floodlights: "flash-outline",
              changingRoom: "shirt-outline",
              beverages: "cafe-outline",
              equipment: "football-outline"
            }
            
            const formattedName = key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')
            
            return (
              <View key={key} style={styles.amenityItem}>
                <View style={styles.amenityNameContainer}>
                  <Ionicons name={amenityIcons[key] || "checkmark-circle-outline"} size={24} color={theme.primary} />
                  <Text style={[styles.amenityName, { color: theme.text }]}>{formattedName}</Text>
                </View>
                <Switch
                  value={value}
                  onValueChange={() => toggleAmenity(key)}
                  trackColor={{ false: theme.border, true: theme.primaryLight }}
                  thumbColor={value ? theme.primary : theme.placeholder}
                />
              </View>
            )
          })}
        </View>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Custom Amenities</Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.customAmenityInputRow}>
              <TextInput
                style={[styles.customAmenityInput, { backgroundColor: theme.cardBackground, color: theme.text, borderColor: theme.border }]}
                value={newAmenityName}
                onChangeText={setNewAmenityName}
                placeholder="Amenity name"
                placeholderTextColor={theme.placeholder}
              />
              
              <TouchableOpacity
                style={[styles.iconSelectorButton, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}
                onPress={() => {
                  // Show icon selection UI - here we just cycle through common icons for simplicity
                  const currentIndex = commonIconOptions.findIndex(opt => opt.icon === newAmenityIcon)
                  const nextIndex = (currentIndex + 1) % commonIconOptions.length
                  setNewAmenityIcon(commonIconOptions[nextIndex].icon)
                }}
              >
                <Ionicons name={newAmenityIcon} size={24} color={theme.primary} />
                <Ionicons name="chevron-down" size={16} color={theme.placeholder} style={styles.iconSelectorArrow} />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.addAmenityButton, { backgroundColor: theme.primary }]}
                onPress={handleAddCustomAmenity}
              >
                <Ionicons name="add" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
          
          {/* List of custom amenities */}
          {customAmenities.map((amenity, index) => (
            <View key={`custom-${index}`} style={styles.customAmenityItem}>
              <View style={styles.amenityNameContainer}>
                <Ionicons name={amenity.icon} size={24} color={theme.primary} />
                <Text style={[styles.amenityName, { color: theme.text }]}>{amenity.name}</Text>
              </View>
              <TouchableOpacity
                style={styles.removeAmenityButton}
                onPress={() => handleRemoveCustomAmenity(index)}
              >
                <Ionicons name="trash-outline" size={20} color={theme.danger} />
              </TouchableOpacity>
            </View>
          ))}
          
          {customAmenities.length === 0 && (
            <Text style={[styles.noAmenitiesText, { color: theme.placeholder }]}>
              No custom amenities added yet
            </Text>
          )}
        </View>
        
        <Button 
          title="Save Changes" 
          onPress={handleSaveChanges} 
          style={styles.saveButton}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
    padding: 16,
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  textarea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 100,
  },
  imageSection: {
    marginBottom: 16,
  },
  mainImageContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  mainImageWrapper: {
    position: "relative",
    width: 200,
    height: 150,
    borderRadius: 8,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  imagePicker: {
    width: 200,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    borderStyle: "dashed",
  },
  imagePickerText: {
    marginTop: 8,
    fontSize: 14,
  },
  changeImageButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 8,
    alignItems: "center",
  },
  changeImageText: {
    color: "#fff",
    fontSize: 14,
  },
  additionalImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
    marginRight: 12,
    marginBottom: 12,
    position: "relative",
  },
  additionalImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  amenityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  amenityNameContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  amenityName: {
    marginLeft: 12,
    fontSize: 16,
  },
  customAmenityInputRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  customAmenityInput: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    marginRight: 8,
  },
  iconSelectorButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    position: "relative",
  },
  iconSelectorArrow: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
  addAmenityButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  customAmenityItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  removeAmenityButton: {
    padding: 8,
  },
  noAmenitiesText: {
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  },
  saveButton: {
    marginTop: 8,
    marginBottom: 40,
  },
})

export default TurfEditScreen