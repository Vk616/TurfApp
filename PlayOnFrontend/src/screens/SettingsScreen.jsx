import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

const SettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <Button title="Change Password" onPress={() => alert("Coming Soon!")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: "center", justifyContent: "center" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
});

export default SettingsScreen;
