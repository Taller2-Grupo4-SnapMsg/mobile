import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, Text, View } from "react-native";
import Avatar from "./Avatar";
import { MaterialIcons } from "@expo/vector-icons"; // Import the checkmark icon from a suitable library

export default function UserSearchForMentionFlatList({
  users,
  showMoreVisible,
  handleShowMoreButton,
  selectedMentions,
  setSelectedMentions,
}) {
  const handleUserSelection = (selectedUser) => {
    if (selectedMentions.includes(selectedUser)) {
      setSelectedMentions(selectedMentions.filter((user) => user !== selectedUser));
    } else {
      setSelectedMentions([...selectedMentions, selectedUser]);
    }
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.email}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.itemContainer} onPress={() => handleUserSelection(item)}>
          <Avatar user={item} />
          <View style={styles.textContainer}>
            <Text style={styles.nameText}>{item.name}</Text>
            <Text style={styles.usernameText}>@{item.username}</Text>
          </View>
          {selectedMentions.includes(item) && ( 
            <MaterialIcons name="check" size={24} color="#6B5A8E" />
          )}
        </TouchableOpacity>
      )}
      ListFooterComponent={() => (
        showMoreVisible && (
          <TouchableOpacity
            style={styles.showMoreButton}
            onPress={handleShowMoreButton}
          >
            <Text>Show More</Text>
          </TouchableOpacity>
        )
      )}
    />
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 10,
    alignItems: "center", // Center the content vertically
  },
  textContainer: {
    marginLeft: 16,
    flex: 1, 
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 14,
    color: '#6B5A8E',
  },
  showMoreButton: {
    alignSelf: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: '#6B5A8E',
    borderRadius: 50,
    width: 100,
    marginTop: 20,
    marginBottom: 40,
  },
});
