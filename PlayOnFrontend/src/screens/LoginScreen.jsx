"use client"

import { useState, useContext } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
} from "react-native"
import { AuthContext } from "../context/AuthContext"
import { ThemeContext } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Button from "../components/Button"

const LoginScreen = ({ navigation }) => {
  const { login } = useContext(AuthContext)
  const { theme, darkMode } = useContext(ThemeContext)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.")
      return
    }
    if (password.length < 8) {
      Alert.alert("Weak Password", "Password must be at least 8 characters long.")
      return
    }

    try {
      setLoading(true)
      await login(email, password)
      navigation.replace("Main", { screen: "Home" })
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Please check your credentials and try again")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient colors={[theme.primary, theme.accent]} style={styles.logoContainer}>
          <Image source={require("../../assets/football.png")} style={styles.logo} resizeMode="contain" />
          <Text style={[styles.appName, { color: theme.text }]}>PlayOn</Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={[styles.header, { color: theme.text }]}>Welcome Back</Text>
          <Text style={[styles.subheader, { color: theme.placeholder }]}>Sign in to continue</Text>

          <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Ionicons name="mail-outline" size={20} color={theme.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Email"
              placeholderTextColor={theme.placeholder}
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <Ionicons name="lock-closed-outline" size={20} color={theme.primary} style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.placeholder}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={theme.placeholder} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={[styles.forgotPasswordText, { color: theme.accent }]}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleLogin} loading={loading} style={styles.loginButton} />

          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.placeholder }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>

          <View style={styles.socialButtons}>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="logo-google" size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="logo-facebook" size={20} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="logo-apple" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>

          <View style={styles.signupContainer}>
            <Text style={[styles.signupText, { color: theme.placeholder }]}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
              <Text style={[styles.signupLink, { color: theme.primary }]}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 80,
    height: 80,
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    marginTop: 10,
  },
  formContainer: {
    flex: 1,
    padding: 24,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subheader: {
    fontSize: 16,
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    height: 55,
  },
  inputIcon: {
    marginHorizontal: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  eyeIcon: {
    padding: 15,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  loginButton: {
    marginBottom: 20,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    paddingHorizontal: 10,
    fontSize: 14,
  },
  socialButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  signupText: {
    fontSize: 16,
  },
  signupLink: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 5,
  },
})

export default LoginScreen

