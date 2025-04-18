"use client"

import { useContext, useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Animated,
  TouchableOpacity,
} from "react-native"
import { TurfContext } from "../context/TurfContext"
import { ThemeContext } from "../context/ThemeContext"
import TurfCard from "../components/TurfCard"
import SearchBar from "../components/SearchBar"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const HomeScreen = ({ navigation }) => {
  const { turfs, loading } = useContext(TurfContext)
  const { theme, darkMode } = useContext(ThemeContext)
  const [searchQuery, setSearchQuery] = useState("")
  const scrollY = useRef(new Animated.Value(0)).current
  const [categories] = useState([
    { id: "all", name: "All", icon: "football" },
    { id: "football", name: "Football", icon: "football" },
    { id: "cricket", name: "Cricket", icon: "baseball" },
    { id: "basketball", name: "Basketball", icon: "basketball" },
    { id: "tennis", name: "Tennis", icon: "tennisball" },
  ])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const animationInitialized = useRef(false)

  useEffect(() => {
    if (!animationInitialized.current) {
      animationInitialized.current = true
    }
  }, [])

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: theme.background }]}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loaderText, { color: theme.text }]}>Loading Turfs...</Text>
      </View>
    )
  }

  const filteredTurfs = turfs.filter((turf) => turf.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleTurfPress = (turf) => {
    navigation.navigate("TurfDetails", { turfId: turf._id })
  }

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: "clamp",
  })

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <Animated.View style={[styles.header, { opacity: headerOpacity, backgroundColor: theme.headerBackground }]}>
        <LinearGradient colors={[theme.primaryLight, theme.background]} style={styles.headerGradient}>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Find Your Perfect</Text>
          <Text style={[styles.headerHighlight, { color: theme.primary }]}>Turf</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.FlatList
        data={filteredTurfs}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        ListHeaderComponent={
          <>
            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

            <FlatList
              data={categories}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesContainer}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.categoryButton,
                    selectedCategory === item.id && { backgroundColor: theme.primary, borderColor: theme.primary },
                  ]}
                  onPress={() => setSelectedCategory(item.id)}
                >
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={selectedCategory === item.id ? theme.text : theme.placeholder}
                  />
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item.id && { color: theme.text, fontWeight: "bold" },
                    ]}
                  >
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </>
        }
        renderItem={({ item }) => <TurfCard turf={item} onPress={handleTurfPress} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color={theme.placeholder} />
            <Text style={[styles.emptyText, { color: theme.placeholder }]}>No turfs found</Text>
          </View>
        }
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerGradient: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerHighlight: {
    fontSize: 36,
    fontWeight: "bold",
    marginTop: -5,
  },
  listContent: {
    padding: 16,
    paddingTop: 130,
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
  categoriesContainer: {
    paddingBottom: 15,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
  },
  categoryText: {
    marginLeft: 5,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 10,
  },
})

export default HomeScreen

