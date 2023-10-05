import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function EditProfileButton({ onPress }) {
    return (
    <TouchableOpacity style={styles.editButton} onPress={onPress}>
        <Feather name="edit" size={24} color={'#6B5A8E'} />
    </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    editButton: {
        position: 'absolute',
        top: 15,
        right: 35,
      },
});    