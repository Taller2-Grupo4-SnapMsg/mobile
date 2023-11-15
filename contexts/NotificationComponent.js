import React from 'react';
import { View, Text, Image } from 'react-native';

function NotificationComponent({ notification, avatarUrl }) {
  //const avatarUrl = notification.data.avatarUrl;

  return (
    <View>
      <Text>{notification.title}</Text>
      <Text>{notification.body}</Text>
      <Image source={{ uri: avatarUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
    </View>
  );
}

export default NotificationComponent;