import React, { useContext, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { TurfContext } from "../context/TurfContext";
import TurfCard from "../components/TurfCard";
import SearchBar from "../components/SearchBar";

const HomeScreen = ({ navigation }) => {
  const { turfs, loading } = useContext(TurfContext);
  const [searchQuery, setSearchQuery] = useState("");

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={styles.loaderColor.color} />
        <Text style={styles.text}>Loading Turfs...</Text>
      </View>
    );
  }

  const filteredTurfs = turfs.filter((turf) =>
    turf.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTurfPress = (turf) => {
    navigation.navigate("TurfDetails", { turfId: turf._id });
  };

  return (
    <View style={styles.container}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FlatList
        data={filteredTurfs}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <TurfCard
            turf={item}
            onPress={() => navigation.navigate("TurfDetails", { turfId: item._id })}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#000",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "#ff0000",
  },
  loaderColor: {
    color: "#ff0000",
  },
});

export default HomeScreen;
