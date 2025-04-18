"use client"

import React, { useEffect, useState, useContext } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getAllTurfs } from "../api/turfApi";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const TurfOwnerDashboardScreen = () => {
  const { user } = useContext(AuthContext);
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
      <View style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#ff5555" />
        <Text style={styles.loadingText}>Loading your turfs...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#111", "#000"]} style={styles.header}>
        <Text style={styles.headerTitle}>Your Turfs</Text>
        <Text style={styles.headerSubtitle}>Manage your turf listings</Text>
      </LinearGradient>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {turfs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>You have no turfs yet.</Text>
          </View>
        ) : (
          turfs.map((turf, idx) => (
            <View key={idx} style={styles.turfCard}>
              <View style={styles.turfHeader}>
                <Text style={styles.turfName}>{turf.name}</Text>
                <Text style={styles.turfPrice}>₹{turf.pricePerHour}/hr</Text>
              </View>
              <View style={styles.turfDetails}>
                <View style={styles.turfDetail}>
                  <Text style={styles.turfDetailLabel}>Location:</Text>
                  <Text style={styles.turfDetailValue}>{turf.location}</Text>
                </View>
                <View style={styles.turfDetail}>
                  <Text style={styles.turfDetailLabel}>Availability:</Text>
                  <Text style={styles.turfDetailValue}>{turf.availability?.length || 0} slots</Text>
                </View>
              </View>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => Alert.alert("Edit Turf", "Feature coming soon")}
                >
                  <Ionicons name="create-outline" size={18} color="#fff" />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionButton, { backgroundColor: "#3366ff" }]}
                  onPress={() => Alert.alert("Manage Availability", "Feature coming soon")}
                >
                  <Ionicons name="time-outline" size={18} color="#fff" />
                  <Text style={styles.actionText}>Availability</Text>
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
  container: { flex: 1, backgroundColor: "#000" },
  header: { paddingTop: 50, paddingBottom: 15, paddingHorizontal: 20 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 16, color: "#aaa", marginTop: 5 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000" },
  loadingText: { color: "#aaa", marginTop: 10, fontSize: 16 },
  content: { flex: 1, padding: 16 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", marginTop: 50 },
  emptyText: { color: "#aaa", fontSize: 18 },
  turfCard: { backgroundColor: "#1a1a1a", borderRadius: 12, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  turfHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  turfName: { fontSize: 16, fontWeight: "bold", color: "#fff" },
  turfPrice: { fontSize: 14, color: "#ff5555", fontWeight: "bold" },
  turfDetails: { marginBottom: 10 },
  turfDetail: { flexDirection: "row", marginBottom: 5 },
  turfDetailLabel: { width: 90, fontSize: 14, color: "#aaa" },
  turfDetailValue: { flex: 1, fontSize: 14, color: "#fff" },
  actions: { flexDirection: "row", justifyContent: "flex-end" },
  actionButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#333", paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, marginLeft: 10 },
  actionText: { color: "#fff", fontSize: 12, marginLeft: 5 },
  emptyText: { color: "#aaa", fontSize: 16 }
});

export default TurfOwnerDashboardScreen;
