import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const avatarLink = 'https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-profiles/avatar-2.webp';

const NotificationMessage = ({ message, data, read }) => {
  return (
    <TouchableOpacity
      disabled={read}
      style={{
        opacity: read ? 0.5 : 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        padding: 10,
        marginBottom: 10,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={{ uri: data.avatarUrl }} style={{ width: 50, height: 50, borderRadius: 25 }} />
        <View style={{ marginLeft: 10 }}>
          <Text style={{ fontWeight: 'bold' }}>{data.user_sender}</Text>
          <Text>{message}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NotificationMessage;

