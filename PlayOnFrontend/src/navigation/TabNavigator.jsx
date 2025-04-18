import React, { useContext } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeScreen from "../screens/HomeScreen";
import BookingHistoryScreen from "../screens/BookingHistoryScreen"; // Renamed for clarity
import EventsScreen from "../screens/EventsScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AdminDashboardScreen from "../screens/AdminDashboardScreen";
import TurfOwnerDashboardScreen from "../screens/TurfOwnerDashboardScreen"; // Add turf owner screen
import { AuthContext } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const { user } = useContext(AuthContext);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === "Home") iconName = "home";
          else if (route.name === "Bookings") iconName = "calendar"; // Booking history
          else if (route.name === "Events") iconName = "trophy";
          else if (route.name === "Notifications") iconName = "notifications";
          else if (route.name === "Settings") iconName = "settings";
          else if (route.name === "Admin") iconName = "shield-checkmark";
          else if (route.name === "Owner") iconName = "football";
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#ff0000", // Red for active tab
        tabBarInactiveTintColor: "#888", // Gray for inactive tabs
        tabBarStyle: {
          backgroundColor: "#111", // Dark background
          borderTopColor: "#ff0000", // Red accent
        },
        headerStyle: {
          backgroundColor: "#111", // Dark header background
        },
        headerTintColor: "#fff", // White text in header
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingHistoryScreen} /> 
      <Tab.Screen name="Events" component={EventsScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      {user && user.role === 'admin' && (
        <Tab.Screen name="Admin" component={AdminDashboardScreen} />
      )}
      {user && user.role === 'turf_owner' && (
        <Tab.Screen name="Owner" component={TurfOwnerDashboardScreen} />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;
