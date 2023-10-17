import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

const IconButton = ({ icon, text, pressed}) => {
  if (!icon) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {pressed ? (
        // Renderiza el icono lleno cuando el botón se ha presionado
        <EvilIcons name={icon} size={30} color="red" />
      ) : (
        <EvilIcons name={icon} size={30} color="gray" />
      )}
      <Text style={{ fontSize: 15, color: 'gray', marginRight: 50 }}>{text || 0}</Text>
    </View>
  );
};

export default IconButton;