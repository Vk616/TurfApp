import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./src/navigation/AppNavigator";
import { AuthProvider } from "./src/context/AuthContext";
import { TurfProvider } from "./src/context/TurfContext";

export default function App() {
  return (
    <AuthProvider>
      <TurfProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </TurfProvider>
    </AuthProvider>
  );
}
