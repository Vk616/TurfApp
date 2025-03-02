import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      {user ? (
        <>
          <Text style={styles.title}>Welcome, {user.name}!</Text>
          <View style={styles.buttonContainer}>
            <Button title="Logout" onPress={() => logout(navigation)} color="#ff0000" />
          </View>
        </>
      ) : (
        <>
          <Text style={styles.errorText}>You are not logged in!</Text>
          <View style={styles.buttonContainer}>
            <Button title="Go to Login" onPress={() => navigation.replace("Login")} color="#ff0000" />
          </View>
        </>
      )}
      <View style={styles.buttonContainer}>
        <Button title="Change Password" onPress={() => alert("Coming Soon!")} color="#ff0000" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111", // Dark background
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // White text
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // White text
  },
  errorText: {
    fontSize: 18,
    color: "#ff4444", // Red for error message
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10, // Space out buttons
    width: "80%", // Keep buttons aligned
  },
});

export default SettingsScreen;