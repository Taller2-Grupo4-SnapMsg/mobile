//me queda pendiente hacer que traiga de a x, recargue y demas
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { query, orderByChild, onValue, endAt, get, limitToLast, ref, push, serverTimestamp, onChildAdded, off } from 'firebase/database';
import { db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';
import NotificationMessage from './NotificationMessage';
import { StyleSheet } from 'react-native';
import NotificationMention from './NotificationMention';

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = ref(db, 'notifications');

  function setInitiaOldestTimestamp(notifications) {
    if (notifications && notifications.length > 0) {
      return notifications[0].timestamp;
    } else {
      return 0;
    }
  }
  const [oldestTimestamp, setOldestTimestamp] = useState(setInitiaOldestTimestamp(notifications));

  const handleGetNotifications = async () => {
    //if (refreshing) return;

    //setRefreshing(true);
    const queryRef = query(
      notificationsRef,
      //orderByChild('timestamp'),
      //endAt(oldestTimestamp - 1), // Fetch notifications with timestamps less than oldestTimestamp
      //limitToLast(AMOUNT_MSGS_BACK)
    );

    try {
      const snapshot = await get(queryRef);
      if (snapshot.exists()) {
        const notificationsArray = [];
        snapshot.forEach((childSnapshot) => {
          const message = childSnapshot.val();
          notificationsArray.push(message);
        });
        if (notificationsArray.length > 0) {
          setNotifications(notificationsArray);
          //const NewNotifications = [...notificationsArray, ...notifications];
          //setNotifications(NewNotifications);
          const newOldestTimestamp = notificationsArray[0].timestamp;
          setOldestTimestamp(newOldestTimestamp);
        }
      }

      //setRefreshing(false);
    } catch (error) {
      // Handle the error, e.g., display an error message
      console.error('Error fetching earlier notifications:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleGetNotifications();
    }, [])
  );

  const renderSeparator = () => <View style={styles.separator} />;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notificationContainer}>
            {item.type === 'message' ? (
              <NotificationMessage message={item.body} data={item.data} read={item.read} />
            ) : item.type === 'mention' ? (
              <NotificationMention message={item.body} data={item.data} read={item.read} />
            ) : null}
            <View style={styles.separator} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  notificationContainer: {
    marginBottom: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  separator: {
    marginVertical: 10,
  },
});

export default NotificationsScreen;
