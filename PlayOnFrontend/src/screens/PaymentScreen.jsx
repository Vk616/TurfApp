import React, { useState } from 'react';
import { View, Text, TextInput, Image, Button, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuth } from '../context/AuthContext';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';


const PaymentScreen = () => {
  const { token } = useAuth();
  const route = useRoute();
  const navigation = useNavigation();
  const { turfId, date, timeSlot, amount } = route.params;

  const [transactionId, setTransactionId] = useState('');

  const handleConfirm = async () => {
    if (!transactionId) {
      Alert.alert('Enter transaction ID to continue');
      return;
    }
  
    try {
      await axios.post(`${Constants.expoConfig.extra.API_URL}/api/payments/verify-payment`, {
        turfId,
        date,
        timeSlot,
        amount,
        transactionId,
        paymentMethod: 'UPI'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      Alert.alert("Booking confirmed!", "", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("Main", { screen: "Home" }); // ✅ Go back to Home tab
          },
        },
      ]);
    } catch (err) {
      console.error(err);
      Alert.alert('Failed to confirm payment');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR to Pay ₹{amount}</Text>
      <Image source={require('../../assets/paymentqr.jpg')} style={styles.qr} />

      <TextInput
        placeholder="Enter UPI Transaction ID"
        value={transactionId}
        onChangeText={setTransactionId}
        style={styles.input}
      />

      <Button title="Confirm Payment & Book" onPress={handleConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  qr: { width: 200, height: 200, marginBottom: 20 },
  input: {
    borderColor: '#ccc', borderWidth: 1, borderRadius: 8,
    padding: 10, width: '100%', marginBottom: 20
  }
});

export default PaymentScreen;
