import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const { theme } = useContext(ThemeContext);
  const clearSearch = () => {
    setSearchQuery("")
  }

  return (
    <View style={[styles.container, { marginBottom: 20 }]}>
      <View style={[styles.searchContainer, {
          backgroundColor: theme.cardBackground,
          borderColor: theme.border
        }]}>
        <Ionicons name="search" size={20} color={theme.primary} style={styles.icon} />
        <TextInput
          style={[styles.input, { color: theme.text }]}
          placeholder="Search turfs..."
          placeholderTextColor={theme.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
            <Ionicons name="close-circle" size={20} color={theme.placeholder} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: "100%",
  },
  clearButton: {
    padding: 5,
  },
})

export default SearchBar

