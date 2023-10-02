import React, { useState } from "react";
import { TouchableOpacity, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { storage } from "../firebase"; // Import your Firebase configuration and storage instance
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AvatarPicker({ selectedImage, onImageSelect, user, setSelectedImage }) {
  const handleImageSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      //Maybe it can be another component= uploadImage?
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const fileName = 'profile_picture.jpg'; 
        const storageRef = ref(storage, `profile_pictures/${user.email}/${fileName}`);

        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob); 

        const downloadURL = await getDownloadURL(storageRef);
        setSelectedImage(downloadURL);
        onImageSelect(downloadURL); 
      }
    } catch (error) {
      console.error('Error selecting the image:', error);
    }
  };

  return (
    <TouchableOpacity onPress={handleImageSelection}>
      <Image style={styles.avatar} source={{ uri: selectedImage }} />
      <MaterialIcons name="photo-camera" size={32} color={'#6B5A8E'} style={styles.cameraIcon} />
    </TouchableOpacity>
  );
}

const styles = {
  avatar: {
    height: 170,
    width: 170,
    borderRadius: 85,
    borderWidth: 2,
    borderColor: "#6B5A8E",
  },
    cameraIcon: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 4,
    },
};
