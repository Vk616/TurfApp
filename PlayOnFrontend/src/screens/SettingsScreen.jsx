"use client"

import { useContext, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, StatusBar, Alert } from "react-native"
import { AuthContext } from "../context/AuthContext"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Button from "../components/Button"

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [darkModeEnabled, setDarkModeEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout(navigation) },
    ])
  }

  const renderSettingItem = (icon, title, description, value, onValueChange) => (
    <View style={styles.settingItem}>
      <View style={styles.settingIconContainer}>
        <Ionicons name={icon} size={22} color="#ff5555" />
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingDescription}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#444", true: "rgba(255, 85, 85, 0.5)" }}
        thumbColor={value ? "#ff5555" : "#aaa"}
      />
    </View>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <LinearGradient colors={["#111", "#000"]} style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSubtitle}>Customize your app experience</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user && (
          <View style={styles.profileSection}>
            <View style={styles.profileImageContainer}>
              <Text style={styles.profileInitial}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileEmail}>{user.email}</Text>
              <View style={styles.profileBadge}>
                <Text style={styles.profileBadgeText}>{user.role}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.editProfileButton}>
              <Ionicons name="create-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>App Settings</Text>

          {renderSettingItem(
            "notifications-outline",
            "Notifications",
            "Receive booking reminders and updates",
            notificationsEnabled,
            setNotificationsEnabled,
          )}

          {renderSettingItem(
            "moon-outline",
            "Dark Mode",
            "Use dark theme throughout the app",
            darkModeEnabled,
            setDarkModeEnabled,
          )}

          {renderSettingItem(
            "location-outline",
            "Location Services",
            "Allow app to access your location",
            locationEnabled,
            setLocationEnabled,
          )}
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Account</Text>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountIconContainer}>
              <Ionicons name="lock-closed-outline" size={22} color="#ff5555" />
            </View>
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>Change Password</Text>
              <Text style={styles.accountDescription}>Update your account password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountIconContainer}>
              <Ionicons name="card-outline" size={22} color="#ff5555" />
            </View>
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>Payment Methods</Text>
              <Text style={styles.accountDescription}>Manage your payment options</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountIconContainer}>
              <Ionicons name="help-circle-outline" size={22} color="#ff5555" />
            </View>
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>Help & Support</Text>
              <Text style={styles.accountDescription}>Contact us for assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountIconContainer}>
              <Ionicons name="information-circle-outline" size={22} color="#ff5555" />
            </View>
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>App Version</Text>
              <Text style={styles.accountDescription}>1.0.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountIconContainer}>
              <Ionicons name="document-text-outline" size={22} color="#ff5555" />
            </View>
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>Terms of Service</Text>
              <Text style={styles.accountDescription}>Read our terms and conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={styles.accountIconContainer}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#ff5555" />
            </View>
            <View style={styles.accountContent}>
              <Text style={styles.accountTitle}>Privacy Policy</Text>
              <Text style={styles.accountDescription}>How we handle your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#aaa" />
          </TouchableOpacity>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon={<Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginLeft: 8 }} />}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#aaa",
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 85, 85, 0.3)",
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(255, 85, 85, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInitial: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ff5555",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
  },
  profileBadge: {
    backgroundColor: "rgba(255, 85, 85, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  profileBadgeText: {
    color: "#ff5555",
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  settingsSection: {
    backgroundColor: "#1a1a1a",
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 85, 85, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: "#aaa",
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 85, 85, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  accountContent: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 2,
  },
  accountDescription: {
    fontSize: 12,
    color: "#aaa",
  },
  logoutButton: {
    marginBottom: 30,
  },
})

export default SettingsScreen

