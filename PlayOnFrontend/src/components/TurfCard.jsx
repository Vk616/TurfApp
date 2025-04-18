import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { ThemeContext } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const TurfCard = ({ turf, onPress }) => {
  const { theme } = useContext(ThemeContext);
  return (
    <TouchableOpacity
      style={[styles.cardContainer, { shadowColor: theme.shadow || '#000' }]}
      onPress={() => onPress(turf)}
      activeOpacity={0.9}
    >
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>  
        <Image source={{ uri: turf.image }} style={styles.image} />
        <LinearGradient
          colors={['transparent', theme.cardBackground + 'CC']}
          style={styles.gradient}
        />
        <View style={styles.infoContainer}>
          <View style={styles.info}>
            <Text style={[styles.name, { color: theme.text }]}>{turf.name}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color={theme.primary} />
              <Text style={[styles.location, { color: theme.placeholder }]}>{turf.location}</Text>
            </View>
            <View style={styles.priceContainer}>
              <Ionicons name="cash-outline" size={16} color={theme.primary} />
              <Text style={[styles.price, { color: theme.primary }]}>₹{turf.pricePerHour}</Text>
              <Text style={[styles.perHour, { color: theme.placeholder }]}>/hr</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 20,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 100,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  infoContainer: {
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    marginLeft: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  perHour: {
    fontSize: 14,
    marginLeft: 2,
  },
});

export default TurfCard;

