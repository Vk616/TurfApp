import React, { useContext } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../context/ThemeContext';

const Button = ({ title, onPress, style, loading, disabled, icon }) => {
  const { theme } = useContext(ThemeContext);
  const gradientColors = disabled
    ? [theme.border, theme.secondary]
    : [theme.primary, theme.accent];

  return (
    <TouchableOpacity
      style={[styles.buttonContainer, style, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        {loading
          ? <ActivityIndicator color={theme.text} size="small" />
          : <Text style={[styles.text, { color: theme.text }]}>{title}</Text>
        }
        {icon && icon}
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  gradient: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;

