import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      await login(email, password);
      navigation.replace("Main", { screen: "Home" });
    } catch (error) {
      alert("Login Failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate("Signup")} style={styles.link}>
        Don't have an account? <Text style={styles.linkHighlight}>Sign Up</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#111", // Dark background
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#fff", // White text
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ff0000", // Red outline
    backgroundColor: "#222", // Dark input field
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
    color: "#fff", // White text inside input
  },
  button: {
    backgroundColor: "#ff0000", // Red button
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff", // White text on button
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#aaa", // Grey text
    textAlign: "center",
  },
  linkHighlight: {
    color: "#ff0000", // Red highlight for Sign Up
    fontWeight: "bold",
  },
});

export default LoginScreen;