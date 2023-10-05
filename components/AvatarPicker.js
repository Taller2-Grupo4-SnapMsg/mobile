import React, { useState, useEffect } from "react";
import { View, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { storage } from "../firebase"; // Import your Firebase configuration and storage instance
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AvatarPicker({
  selectedImage,
  onImageSelect,
  user,
  setSelectedImage,
}) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false); // Reset the loading state when the selectedImage changes.
  }, [selectedImage]);

  const handleImageSelection = async () => {
    try {

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      setIsLoading(true); // Set loading to true when image selection starts.

      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const fileName = "profile_picture.jpg";
        const storageRef = ref(
          storage,
          `profile_pictures/${user.email}/${fileName}`
        );

        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        setSelectedImage(downloadURL);
        onImageSelect(downloadURL);
      }
    } catch (error) {
      console.error("Error selecting the image:", error);
    } finally {
      setIsLoading(false); // Set loading back to false when the process is done (even if there's an error).
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleImageSelection}>
        {isLoading ? (
          <ActivityIndicator size="large" color="#6B5A8E" style={styles.spinner} />
        ) : (
          <>
            <Image style={styles.avatar} source={{ uri: selectedImage }} />
            <MaterialIcons
              name="photo-camera"
              size={32}
              color={"#6B5A8E"}
              style={styles.cameraIcon}
            />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  container: {
    height: 170, // Set a fixed height for the container
  },
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
  spinner: {
    marginTop: 70, // Adjust the margin to move the spinner downwards
  },
};
