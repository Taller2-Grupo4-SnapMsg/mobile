import React from 'react';
import { Modal, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';

export default function ProfileModal({ isVisible, imageUrl, onClose }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Feather name="x" size={24} color="white" />
          </TouchableOpacity>
          <Image
            style={styles.modalAvatar}
            source={{
              uri: imageUrl || 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-3.jpg',
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalContainer: {
        width: 250,
        height: 250,
        borderRadius: 125,
        justifyContent: 'center',
        alignItems: 'center',
      },
      modalAvatar: {
        width: 200,
        height: 200,
        borderRadius: 100,
        borderWidth: 3,
        borderColor: '#6B5A8E'
      },
      closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
});