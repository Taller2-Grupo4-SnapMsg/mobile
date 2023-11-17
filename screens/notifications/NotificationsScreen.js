import React, { useEffect, useState } from 'react';
import { query, orderByChild, limitToLast, ref, get, onChildAdded, off, endAt } from 'firebase/database';
import { db } from '../../firebase';
import { useFocusEffect } from '@react-navigation/native';
import NotificationMessage from './NotificationMessage';
import NotificationMention from './NotificationMention';
import { useUser } from '../../contexts/UserContext';
import { View, Text, FlatList, RefreshControl, StyleSheet } from 'react-native';
import LoadingMoreIndicator from '../../components/LoadingMoreIndicator';

const AMOUNT_NOTIFICATIONS = 10;

function generateUserEmailID(user_receiver_email) {
  return `${user_receiver_email.replace(/[\.\#\$\/\[\]]/g, '_')}`;
}

const NotificationsScreen = () => {
  const { loggedInUser } = useUser();
  const [notifications, setNotifications] = useState([]);
  const notificationsRef = ref(db, `notifications/${generateUserEmailID(loggedInUser.email)}`);
  const [refreshing, setRefreshing] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [fin, setFin] = useState(false);
  const [oldestTimeStamp, setOldestTimeStamp] = useState(null);

  const handleGetMoreNotifications = async (oldestTimeStamp, refresh) => {
    if (fin) return;
    if (loadingMore || (reachedEnd && !refresh)) return;

    try {
      setLoadingMore(true);
      setRefreshing(refresh);

      queryRef = query(
        notificationsRef,
        orderByChild('timestamp'),
        endAt(oldestTimeStamp - 1), 
        limitToLast(AMOUNT_NOTIFICATIONS)
      );

      const snapshot = await get(queryRef);

      if (snapshot.exists()) {
        const notificationsArray = Object.values(snapshot.val()).reverse();
        if (notificationsArray.length > 0) {
          if (refresh) {
            setNotifications(notificationsArray);
            setRefreshing(false);
            setReachedEnd(false);
          } else {
            setNotifications((prevNotifications) => [...prevNotifications, ...notificationsArray]);
          }
          if (notificationsArray.length >= AMOUNT_NOTIFICATIONS) {
            const newOldestTimestamp = notificationsArray[AMOUNT_NOTIFICATIONS - 1].timestamp;
            setOldestTimeStamp(newOldestTimestamp);
          } else {
            setFin(true);
          }
        } else {
          setReachedEnd(true);
          setRefreshing(false);
        }
      }
    } catch (error) {
      console.error('Error while loading more notifications:', error);
    } finally {
      setLoadingMore(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      handleGetMoreNotifications((new Date()).getTime(), true);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notificationId}
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleGetMoreNotifications((new Date()).getTime(), true)}
            colors={['#947EB0']}
          />
        }
        onEndReached={() => handleGetMoreNotifications(oldestTimeStamp, false)}
        onEndReachedThreshold={0.1}
      />
    {loadingMore && <LoadingMoreIndicator />}
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