import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';

export default function ProfilePicture({ imageUrl, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={styles.avatar}
        source={{
          uri: imageUrl || 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-3.jpg',
        }}
      />
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#6B5A8E',
    margin: 10,
  },
});