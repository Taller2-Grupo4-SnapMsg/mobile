import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const NotificationMessage = ({ message, data, read, onPress }) => {
  return (
    <TouchableOpacity
      disabled={read}
      style={[styles.container, { opacity: read ? 0.5 : 1 }]}
      onPress={() => onPress(data)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.boldText}>You have a new message!</Text>
        <View style={styles.rowContainer}>
          <Image source={{ uri: data.avatarUrl }} style={styles.avatar} />
          <View>
            <Text style={styles.username}>{data.user_sender}</Text>
            <Text>{message}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  textContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  boldText: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#6B5A8E',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  username: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default NotificationMessage;
