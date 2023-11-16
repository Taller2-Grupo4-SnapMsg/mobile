//me queda pendiente hacer que traiga de a x, recargue y demas
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { query, orderByChild, onValue, endAt, get, limitToLast, ref, push, serverTimestamp, onChildAdded, off, set } from 'firebase/database';
import { db } from '../../firebase';
import NotificationMessage from './NotificationMessage';
import { StyleSheet } from 'react-native';
import NotificationMention from './NotificationMention';
import { useUser } from '../../contexts/UserContext';
import { useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

function generateUserEmailID(user_receiver_email) {
  return `${user_receiver_email.replace(/[\.\#\$\/\[\]]/g, '_')}`;
}

AMOUNT_NOTIFICATIONS_BACK = 1
AMOUNT_NOTIFICATIONS_BEGINNING = 1

const NotificationsScreen = () => {
  const { loggedInUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  const [oldestTimestamp, setOldestTimestamp] = useState(0); // Inicializa con 0
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const notificationsRef = ref(db, `notifications/${generateUserEmailID(loggedInUser.email)}`);

  // ... (resto del código)

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          const notificationsRef = ref(db, `notifications/${generateUserEmailID(loggedInUser.email)}`);
          const notificationQuery = query(
            notificationsRef,
            orderByChild('timestamp'),
            limitToLast(AMOUNT_NOTIFICATIONS_BEGINNING)
          );

          const snapshot = await get(notificationQuery);

          if (snapshot.exists()) {
            const notificationsArray = [];
            snapshot.forEach((childSnapshot) => {
              const notification = childSnapshot.val();
              notificationsArray.push(notification);
            });

            if (notificationsArray.length > 0) {
              const newNotifications = [...notifications, ...notificationsArray];
              setNotifications(newNotifications);
              setOldestTimestamp(notificationsArray[0].timestamp);
            }
          }
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      };

      fetchData();
    }, [loggedInUser.email])
  );

  const handleGetOlderNotifications = async () => {
    if (refreshing) return;
    setRefreshing(true);

    const queryRef = query(
      notificationsRef,
      orderByChild('timestamp'),
      endAt(oldestTimestamp - 1),
      limitToLast(AMOUNT_NOTIFICATIONS_BACK)
    );

    try {
      const snapshot = await get(queryRef);

      if (snapshot.exists()) {
        const notificationsArray = [];
        snapshot.forEach((childSnapshot) => {
          const notification = childSnapshot.val();
          notificationsArray.push(notification);
        });

        if (notificationsArray.length > 0) {
          const newNotifications = [...notifications, ...notificationsArray];
          setNotifications(newNotifications);
          setOldestTimestamp(notificationsArray[0].timestamp);
        }
      }

      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching earlier notifications:', error);
    }
  };


  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={notifications}

        renderItem={({ item }) => {
          if (item.type === 'message') {
            return <NotificationMessage message={item.body} data={item.data} read={item.read}  />;
          } else if (item.type === 'mention') {
            return <NotificationMention message={item.body} data={item.data} read={item.read}  />;
          }
        }}
        keyExtractor={(item) => item.notificationId}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleGetOlderNotifications}
          />
        }
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
