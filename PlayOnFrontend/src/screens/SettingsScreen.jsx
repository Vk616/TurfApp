"use client"

import { useContext, useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, StatusBar, Alert } from "react-native"
import { AuthContext } from "../context/AuthContext"
import { ThemeContext } from "../context/ThemeContext"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import Button from "../components/Button"

const SettingsScreen = ({ navigation }) => {
  const { user, logout } = useContext(AuthContext)
  const { theme, darkMode, toggleTheme } = useContext(ThemeContext)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const [locationEnabled, setLocationEnabled] = useState(true)

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => logout(navigation) },
    ])
  }

  const renderSettingItem = (icon, title, description, value, onValueChange) => (
    <View style={[styles.settingItem, { borderBottomColor: theme.border }]}>
      <View style={[styles.settingIconContainer, { backgroundColor: theme.cardBackground }]}>
        <Ionicons name={icon} size={22} color={theme.primary} />
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.settingDescription, { color: theme.placeholder }]}>{description}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: theme.border, true: theme.primary }}
        thumbColor={value ? theme.primary : theme.placeholder}
      />
    </View>
  )

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      <LinearGradient
        colors={[theme.headerBackground, theme.background]}
        style={styles.header}
      >
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <Text style={[styles.headerSubtitle, { color: theme.placeholder }]}>Customize your app experience</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {user && (
          <View style={[styles.profileSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
            <View style={[styles.profileImageContainer, { backgroundColor: theme.primaryLight }]}>
              <Text style={[styles.profileInitial, { color: theme.primary }]}>{user.name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: theme.text }]}>{user.name}</Text>
              <Text style={[styles.profileEmail, { color: theme.placeholder }]}>{user.email}</Text>
              <View style={[styles.profileBadge, { backgroundColor: theme.primaryLight }]}>
                <Text style={[styles.profileBadgeText, { color: theme.primary }]}>{user.role}</Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: theme.overlay }]}>
              <Ionicons name="create-outline" size={20} color={theme.text} />
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.settingsSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>App Settings</Text>

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
            "Use theme throughout the app",
            darkMode,
            toggleTheme,
          )}

          {renderSettingItem(
            "location-outline",
            "Location Services",
            "Allow app to access your location",
            locationEnabled,
            setLocationEnabled,
          )}
        </View>

        <View style={[styles.settingsSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Account</Text>

          <TouchableOpacity style={styles.accountItem}>
            <View style={[styles.accountIconContainer, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="lock-closed-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.accountContent}>
              <Text style={[styles.accountTitle, { color: theme.text }]}>Change Password</Text>
              <Text style={[styles.accountDescription, { color: theme.placeholder }]}>Update your account password</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={[styles.accountIconContainer, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="card-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.accountContent}>
              <Text style={[styles.accountTitle, { color: theme.text }]}>Payment Methods</Text>
              <Text style={[styles.accountDescription, { color: theme.placeholder }]}>Manage your payment options</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={[styles.accountIconContainer, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="help-circle-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.accountContent}>
              <Text style={[styles.accountTitle, { color: theme.text }]}>Help & Support</Text>
              <Text style={[styles.accountDescription, { color: theme.placeholder }]}>Contact us for assistance</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
          </TouchableOpacity>
        </View>

        <View style={[styles.settingsSection, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>About</Text>

          <TouchableOpacity style={styles.accountItem}>
            <View style={[styles.accountIconContainer, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="information-circle-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.accountContent}>
              <Text style={[styles.accountTitle, { color: theme.text }]}>App Version</Text>
              <Text style={[styles.accountDescription, { color: theme.placeholder }]}>1.0.0</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={[styles.accountIconContainer, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="document-text-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.accountContent}>
              <Text style={[styles.accountTitle, { color: theme.text }]}>Terms of Service</Text>
              <Text style={[styles.accountDescription, { color: theme.placeholder }]}>Read our terms and conditions</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.accountItem}>
            <View style={[styles.accountIconContainer, { backgroundColor: theme.cardBackground }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.primary} />
            </View>
            <View style={styles.accountContent}>
              <Text style={[styles.accountTitle, { color: theme.text }]}>Privacy Policy</Text>
              <Text style={[styles.accountDescription, { color: theme.placeholder }]}>How we handle your data</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.placeholder} />
          </TouchableOpacity>
        </View>

        <Button
          title="Logout"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon={<Ionicons name="log-out-outline" size={20} color={theme.text} style={{ marginLeft: 8 }} />}
        />
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInitial: {
    fontSize: 30,
    fontWeight: "bold",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    marginBottom: 8,
  },
  profileBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  profileBadgeText: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  editProfileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  settingsSection: {
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
  },
  accountItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  accountIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  accountContent: {
    flex: 1,
  },
  accountTitle: {
    fontSize: 16,
    marginBottom: 2,
  },
  accountDescription: {
    fontSize: 12,
  },
  logoutButton: {
    marginBottom: 30,
  },
})

export default SettingsScreen

