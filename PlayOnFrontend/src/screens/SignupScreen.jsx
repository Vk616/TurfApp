import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, StatusBar } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";

const SignupScreen = ({ navigation }) => {
  const { register } = useContext(AuthContext);
  const { theme, darkMode } = useContext(ThemeContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validatePhone = (phone) => {
    return phone.length === 10 && /^[0-9]+$/.test(phone);
  };

  const handleSignup = async () => {
    if (!validateEmail(email)) {
      alert("Invalid email format");
      return;
    }
    if (!validatePassword(password)) {
      alert("Password must be at least 8 characters long");
      return;
    }
    if (!validatePhone(phone)) {
      alert("Phone number must be exactly 10 digits");
      return;
    }
    try {
      await register(name, email, password, phone);
      navigation.replace("Main", { screen: "Home" });
    } catch (error) {
      alert("Signup Failed: " + error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <Text style={[styles.header, { color: theme.text }]}>Sign Up</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.text }]}
        placeholder="Name"
        placeholderTextColor={theme.placeholder}
        onChangeText={setName}
        value={name}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.text }]}
        placeholder="Email"
        placeholderTextColor={theme.placeholder}
        onChangeText={setEmail}
        value={email}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.text }]}
        placeholder="Phone"
        placeholderTextColor={theme.placeholder}
        onChangeText={setPhone}
        value={phone}
      />
      <TextInput
        style={[styles.input, { backgroundColor: theme.cardBackground, borderColor: theme.border, color: theme.text }]}
        placeholder="Password"
        placeholderTextColor={theme.placeholder}
        secureTextEntry
        onChangeText={setPassword}
        value={password}
      />
      <TouchableOpacity style={[styles.button, { backgroundColor: theme.primary }]} onPress={handleSignup}>
        <Text style={[styles.buttonText, { color: theme.text }]}>Sign Up</Text>
      </TouchableOpacity>
      <Text onPress={() => navigation.navigate("Login")} style={[styles.link, { color: theme.placeholder }]}>
        Already have an account? <Text style={[styles.linkHighlight, { color: theme.primary }]}>Login</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    padding: 12,
    marginBottom: 12,
    borderRadius: 8,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    textAlign: "center",
  },
  linkHighlight: {
    fontWeight: "bold",
  },
});

export default SignupScreen;
