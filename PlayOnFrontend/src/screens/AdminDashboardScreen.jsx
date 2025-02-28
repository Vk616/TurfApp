import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getAllUsers, getAllBookings } from "../api/adminApi";

const AdminDashboardScreen = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userData = await getAllUsers(user.token);
        const bookingData = await getAllBookings(user.token);
        setUsers(userData);
        setBookings(bookingData);
      } catch (error) {
        console.error("Error loading admin data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>
      <Text>Users:</Text>
      <FlatList data={users} keyExtractor={(item) => item._id} renderItem={({ item }) => <Text>{item.name}</Text>} />
      <Text>Bookings:</Text>
      <FlatList data={bookings} keyExtractor={(item) => item._id} renderItem={({ item }) => <Text>{item.turf.name}</Text>} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

export default AdminDashboardScreen;
