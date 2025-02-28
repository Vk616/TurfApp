import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Request Notification Permission
export const requestNotificationPermission = async () => {
  const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
  if (status !== "granted") {
    alert("Permission for push notifications was denied");
  }
};

// Send Local Notification
export const sendLocalNotification = async (title, body) => {
  await Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds: 1 },
  });
};

// Save Push Token
export const savePushToken = async (token) => {
  await AsyncStorage.setItem("pushToken", token);
};

// Retrieve Push Token
export const getPushToken = async () => {
  return await AsyncStorage.getItem("pushToken");
};
