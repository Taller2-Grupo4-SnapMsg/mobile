import React from 'react';
import { View, Text } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

const IconButton = ({ icon, text }) => {
  if (!icon && !text) {
    return null;
  }

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {icon && <EvilIcons name={icon} size={22} color="gray" />}
      {text && <Text style={{ fontSize: 12, color: 'gray' }}>{text}</Text>}
    </View>
  );
};

export default IconButton;