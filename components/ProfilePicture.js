import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { StyleSheet } from 'react-native';

export default function ProfilePicture({ imageUrl, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <Image
        style={styles.avatar}
        source={{
          uri: imageUrl,
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