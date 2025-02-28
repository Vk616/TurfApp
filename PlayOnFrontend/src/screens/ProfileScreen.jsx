import React, { useContext } from "react";
import { View, Text, Button, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

const ProfileScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>You are not logged in!</Text>
        <Button title="Go to Login" onPress={() => navigation.replace("Login")} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user.name}!</Text>
      <Button title="Logout" onPress={() => logout(navigation)} />
    </View>
  );
};


const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
});

export default ProfileScreen;
