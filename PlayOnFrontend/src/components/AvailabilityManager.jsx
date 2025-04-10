import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

const AvailabilityManager = ({ availability, onChange }) => {
  const [slots, setSlots] = useState([]);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [currentEditIndex, setCurrentEditIndex] = useState(null);
  const [newSlot, setNewSlot] = useState({
    start: new Date(),
    end: new Date(new Date().getTime() + 60 * 60 * 1000), // Default 1 hour later
  });

  // Initialize slots when component mounts or availability prop changes
  useEffect(() => {
    if (availability && Array.isArray(availability)) {
      // Convert ISO strings to Date objects if needed
      const formattedSlots = availability.map(slot => ({
        start: new Date(slot.start),
        end: new Date(slot.end),
      }));
      setSlots(formattedSlots);
    }
  }, [availability]);

  // Update parent component when slots change
  useEffect(() => {
    if (onChange) {
      onChange(slots);
    }
  }, [slots, onChange]);

  const handleAddSlot = () => {
    // Validate the new slot
    if (newSlot.start >= newSlot.end) {
      Alert.alert("Invalid Time Range", "End time must be after start time.");
      return;
    }

    // Check for overlaps with existing slots
    if (checkForOverlap(newSlot)) {
      Alert.alert("Time Conflict", "This slot overlaps with an existing slot.");
      return;
    }

    // Add the new slot and sort by start time
    const updatedSlots = [...slots, newSlot].sort((a, b) => a.start - b.start);
    setSlots(updatedSlots);
    
    // Reset the new slot to current time + 1 hour
    const now = new Date();
    setNewSlot({
      start: now,
      end: new Date(now.getTime() + 60 * 60 * 1000),
    });
  };

  const handleEditSlot = (index) => {
    setCurrentEditIndex(index);
    setNewSlot({
      start: new Date(slots[index].start),
      end: new Date(slots[index].end),
    });
  };

  const handleUpdateSlot = () => {
    // Validate the updated slot
    if (newSlot.start >= newSlot.end) {
      Alert.alert("Invalid Time Range", "End time must be after start time.");
      return;
    }

    // Create a temporary array without the current slot to check for overlaps
    const otherSlots = slots.filter((_, index) => index !== currentEditIndex);
    if (checkForOverlap(newSlot, otherSlots)) {
      Alert.alert("Time Conflict", "This slot overlaps with an existing slot.");
      return;
    }

    // Update the slot and sort
    const updatedSlots = [...slots];
    updatedSlots[currentEditIndex] = newSlot;
    setSlots(updatedSlots.sort((a, b) => a.start - b.start));
    setCurrentEditIndex(null);
  };

  const handleDeleteSlot = (index) => {
    Alert.alert(
      "Delete Time Slot",
      "Are you sure you want to delete this availability slot?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => {
            const updatedSlots = slots.filter((_, i) => i !== index);
            setSlots(updatedSlots);
          }
        }
      ]
    );
  };

  const checkForOverlap = (slotToCheck, slotList = slots) => {
    return slotList.some(slot => 
      (slotToCheck.start < slot.end && slotToCheck.end > slot.start)
    );
  };

  const handleStartChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setNewSlot(prev => ({ ...prev, start: selectedDate }));
    }
  };

  const handleEndChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setNewSlot(prev => ({ ...prev, end: selectedDate }));
    }
  };

  const formatTimeDisplay = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDateDisplay = (date) => {
    return date.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Availability</Text>
      
      <View style={styles.addContainer}>
        <Text style={styles.subtitle}>Add New Time Slot</Text>
        
        <View style={styles.timeInputContainer}>
          <TouchableOpacity 
            style={styles.timeButton} 
            onPress={() => setShowStartPicker(true)}
          >
            <Ionicons name="time-outline" size={20} color="#ff5555" />
            <Text style={styles.timeButtonText}>
              Start: {formatTimeDisplay(newSlot.start)} - {formatDateDisplay(newSlot.start)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.timeButton}
            onPress={() => setShowEndPicker(true)}
          >
            <Ionicons name="time-outline" size={20} color="#ff5555" />
            <Text style={styles.timeButtonText}>
              End: {formatTimeDisplay(newSlot.end)} - {formatDateDisplay(newSlot.end)}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.addButton}
          onPress={currentEditIndex !== null ? handleUpdateSlot : handleAddSlot}
        >
          <Ionicons name={currentEditIndex !== null ? "checkmark" : "add"} size={20} color="#fff" />
          <Text style={styles.addButtonText}>
            {currentEditIndex !== null ? "Update Slot" : "Add Slot"}
          </Text>
        </TouchableOpacity>

        {currentEditIndex !== null && (
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => setCurrentEditIndex(null)}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.slotsList}>
        <Text style={styles.subtitle}>Current Time Slots</Text>
        
        {slots.length === 0 ? (
          <Text style={styles.emptyText}>No availability slots added yet</Text>
        ) : (
          slots.map((slot, index) => (
            <View key={index} style={styles.slotItem}>
              <View style={styles.slotInfo}>
                <Text style={styles.slotDate}>{formatDateDisplay(slot.start)}</Text>
                <Text style={styles.slotTime}>
                  {formatTimeDisplay(slot.start)} - {formatTimeDisplay(slot.end)}
                </Text>
              </View>
              <View style={styles.slotActions}>
                <TouchableOpacity 
                  style={styles.editButton} 
                  onPress={() => handleEditSlot(index)}
                >
                  <Ionicons name="create-outline" size={20} color="#4CAF50" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteSlot(index)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff5555" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {showStartPicker && (
        <DateTimePicker
          value={newSlot.start}
          mode="datetime"
          is24Hour={false}
          display="default"
          onChange={handleStartChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={newSlot.end}
          mode="datetime"
          is24Hour={false}
          display="default"
          onChange={handleEndChange}
          minimumDate={new Date(newSlot.start.getTime() + 15 * 60000)} // Minimum 15 mins after start
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ccc",
    marginBottom: 12,
    marginTop: 8,
  },
  addContainer: {
    marginBottom: 20,
  },
  timeInputContainer: {
    marginBottom: 12,
  },
  timeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  timeButtonText: {
    color: "#fff",
    marginLeft: 8,
    fontSize: 14,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ff5555",
    padding: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  cancelButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    marginTop: 8,
  },
  cancelButtonText: {
    color: "#ff5555",
  },
  slotsList: {
    maxHeight: 300,
  },
  slotItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  slotInfo: {
    flex: 1,
  },
  slotDate: {
    color: "#ff5555",
    fontSize: 12,
    marginBottom: 4,
  },
  slotTime: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  slotActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  editButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
  },
  emptyText: {
    color: "#666",
    fontStyle: "italic",
    padding: 12,
    textAlign: "center",
  },
});

export default AvailabilityManager;