import React from "react";

import { StyleSheet, TextInput, TouchableOpacity, Text, View } from "react-native";
export default function SearchBar(
    {searchText,
    setSearchText,
    handleSearchButton}
) {
    return (
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearchButton}>
          <Text style = {styles.buttonText}>Search</Text>
        </TouchableOpacity>
      </View>
    )
}

const styles = StyleSheet.create({
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
      },
      searchInput: {
        flex: 1,
        borderWidth: 1,
        borderRadius: 20,
        padding: 5,
        borderColor: '#6B5A8E',
        paddingLeft: 15,
      },
      searchButton: {
        marginLeft: 10,
        backgroundColor: '#6B5A8E',
        padding: 10,
        borderRadius: 50,
      },
      buttonText: {
        color: 'white',
      },
});    