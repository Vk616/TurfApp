"use client"

import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { getAllTurfs } from "../api/turfApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const TurfOwnerDashboardScreen = () => {
  const { user } = useContext(AuthContext);
  const { theme, darkMode } = useContext(ThemeContext);
  const [turfs, setTurfs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const allTurfs = await getAllTurfs();
        // Filter turfs owned by the current user
        const ownerTurfs = allTurfs.filter(t => t.owner === user._id);
        setTurfs(ownerTurfs);
      } catch (error) {
        console.error("Error fetching owned turfs:", error);
        Alert.alert("Error", "Failed to load your turfs.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.loadingText, { color: theme.placeholder }]}>Loading your turfs...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <LinearGradient
        colors={[theme.headerBackground, theme.background]}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>Your Turfs</Text>
        <Text style={[styles.headerSubtitle, { color: theme.placeholder }]}>Manage your turf listings</Text>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {turfs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.placeholder }]}>You have no turfs yet.</Text>
          </View>
        ) : (
          turfs.map((turf, idx) => (
            <View key={idx} style={[styles.turfCard, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
              <View style={styles.turfHeader}>
                <Text style={[styles.turfName, { color: theme.text }]}>{turf.name}</Text>
                <Text style={[styles.turfPrice, { color: theme.primary }]}>₹{turf.pricePerHour}/hr</Text>
              </View>
              <View style={styles.turfDetails}>
                <View style={styles.turfDetail}>
                  <Text style={[styles.turfDetailLabel, { color: theme.placeholder }]}>Location:</Text>
                  <Text style={[styles.turfDetailValue, { color: theme.text }]}>{turf.location}</Text>
                </View>
                <View style={styles.turfDetail}>
                  <Text style={[styles.turfDetailLabel, { color: theme.placeholder }]}>Availability:</Text>
                  <Text style={[styles.turfDetailValue, { color: theme.text }]}>{turf.availability?.length || 0} slots</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.primaryLight }]}
                  onPress={() => Alert.alert("Edit Turf", "Feature coming soon")}
                >
                  <Ionicons name="create-outline" size={18} color={theme.text} />
                  <Text style={[styles.actionText, { color: theme.text }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: theme.accent }]}
                  onPress={() => Alert.alert("Manage Availability", "Feature coming soon")}
                >
                  <Ionicons name="time-outline" size={18} color={theme.text} />
                  <Text style={[styles.actionText, { color: theme.text }]}>Availability</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold" },
  headerSubtitle: { fontSize: 16, marginTop: 5 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16 },
  content: { flex: 1, padding: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  emptyText: { fontSize: 18 },
  turfCard: { borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1 },
  turfHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  turfName: { fontSize: 16, fontWeight: "bold" },
  turfPrice: { fontSize: 14, fontWeight: "bold" },
  turfDetails: { marginBottom: 10 },
  turfDetail: { flexDirection: "row", marginBottom: 5 },
  turfDetailLabel: { width: 90, fontSize: 14 },
  turfDetailValue: { flex: 1, fontSize: 14 },
  actions: { flexDirection: "row", justifyContent: "flex-end" },
  actionButton: { flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginLeft: 10 },
  actionText: { fontSize: 12, marginLeft: 5 }
});

export default TurfOwnerDashboardScreen;
