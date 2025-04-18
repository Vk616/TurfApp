import React, { createContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import { lightTheme, darkTheme } from "../styles/colors";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = Appearance.getColorScheme();
  const [darkMode, setDarkMode] = useState(colorScheme === 'dark');
  const theme = darkMode ? darkTheme : lightTheme;

  const toggleTheme = () => setDarkMode(prev => !prev);

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setDarkMode(colorScheme === 'dark');
    });
    return () => listener.remove();
  }, []);

  return (
    <ThemeContext.Provider value={{ darkMode, theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};