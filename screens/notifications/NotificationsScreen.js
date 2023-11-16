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
  const [latestTimestamp, setLatestTimestamp] = useState(0);
  const [oldestTimestamp, setOldestTimestamp] = useState(0);
  const flatListRef = useRef(null);
  const [refreshing, setRefreshing] = useState(false);
  const notificationsRef = ref(db, `notifications/${generateUserEmailID(loggedInUser.email)}`);

  const onChildAddedCallback = (snapshot) => {
    if (snapshot) {
      const newNotification = snapshot.val();
      if (newNotification.timestamp > latestTimestamp) {
        setLatestTimestamp(newNotification.timestamp);
        setNotifications((prevNotifications) => [newNotification, ...prevNotifications]);
        console.log("onChildAddedCallback", newNotification)
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onChildAdded(notificationsRef, onChildAddedCallback);

    return () => {
      off(notificationsRef, 'child_added', onChildAddedCallback);
    };
  }, []);


  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          console.log("fetchData")
          const notificationsRef = ref(db, `notifications/${generateUserEmailID(loggedInUser.email)}`);
          const notificationQuery = query(
            notificationsRef,
            orderByChild('timestamp'),
            limitToLast(AMOUNT_NOTIFICATIONS_BEGINNING)
          );
          const snapshot = await get(notificationQuery);
          if (snapshot.exists()) {
            const newest_notifications = Object.values(snapshot.val());
            console.log("newest_notifications", newest_notifications)
            setNotifications(newest_notifications);
            console.log(newest_notifications)
            setLatestTimestamp(newest_notifications[newest_notifications.length - 1].timestamp);
            setOldestTimestamp(newest_notifications[0].timestamp);
            
          } else {
            setNotifications([]);
            setLatestTimestamp(0);
            setOldestTimestamp(0);
          }
        } catch (error) {
          // handle error
        }
      };
    }, [])
  );
  
  const handleGetOlderNotifications = async () => {
    console.log("handleGetOlderNotifications")
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
          const newNotifications = [...notificationsArray, ...notifications];
          setNotifications(newNotifications.reverse());
          setOldestTimestamp(notificationsArray[0].timestamp);
        }
      }

      setRefreshing(false);
    } catch (error) {
      console.error('Error fetching earlier messages:', error);
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
