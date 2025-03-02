import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { AuthContext } from "../context/AuthContext";

const SignupScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = async () => {
    try {
      await register(name, email, password, phone);
      navigation.replace("Home");
    } catch (error) {
      alert("Signup Failed: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#aaa"
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Phone"
        placeholderTextColor="#aaa"
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#aaa"
        secureTextEntry
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate("Login")} style={styles.link}>
        Already have an account? <Text style={styles.linkHighlight}>Login</Text>
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
    color: "#ff0000", // Red highlight for Login
    fontWeight: "bold",
  },
});

export default SignupScreen;
