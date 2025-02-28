import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NotificationsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <Text>No new notifications</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: "center", justifyContent: "center" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

export default NotificationsScreen;
