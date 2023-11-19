// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import getUserByToken from '../handlers/getUserByToken';
const UserContext = createContext();
import { db } from '../firebase';
import { ref, set, get } from 'firebase/database';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import SaveTokenDevice from '../handlers/notifications/saveTokenDevice';
import WebSocket from 'react-native-websocket';

import { useRef } from 'react';
import { Platform } from 'react-native';

const appConfig = require('../app.json')
const projectId = appConfig?.expo?.extra?.eas?.projectId;
const webSocketUrl = 'wss://skglvayb:RVulev-DurTkD_kARAFR5idNzUPqO88T@jackal.rmq.cloudamqp.com/skglvayb';

export function UserProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notificationReceived, setNotificationReceived] = useState(false);
  const [wsRabbitMQ, setWSRabbitMQ] = useState(null)

  async function registerForPushNotificationsAsync() {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    let token;
  
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync({projectId})).data;
      await SaveTokenDevice(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  }

  function generateUserEmailID(user_receiver_email) {
    return `${user_receiver_email.replace(/[\.\#\$\/\[\]]/g, '_')}`;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const identifier = notification.request.identifier;
      const route = notification.request.content.data.route;
      if (route === "message") {
        const user_receiver = notification.request.content.data.user_receiver;
        const newNotif = {
          type: 'message',
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
          timestamp: Date.now(),
          read: false,
        };
        const notificationId = identifier;
        const notifRef = ref(db, `notifications/${generateUserEmailID(user_receiver)}/${notificationId}`);

        get(notifRef)
          .then(() => {
              set(notifRef, {
                notificationId,
                ...newNotif,
              }).catch((error) => {
                // Catch any errors while saving the notification
              });
            }
          );

        setNotificationReceived(true);
      }
  
      if (route === 'mention') {
        const post_id = notification.request.content.data.post_id;
        const user_receiver = notification.request.content.data.user_receiver;
        const newNotif = {
          type: 'mention',
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
          timestamp: Date.now(),
          read: false,
        };
  
        const notificationId = identifier;
        const notifRef = ref(db, `notifications/${generateUserEmailID(user_receiver)}/${notificationId}`);

        get(notifRef)
          .then(() => {
              set(notifRef, {
                notificationId,
                ...newNotif,
              }).catch((error) => {
                // Catch any errors while saving the notification
              });
            }
          );
  
        setNotificationReceived(true);
      }
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  useEffect(() => {
    const fetchLoggedInUser = async () => {
      try {
        const user = await getUserByToken(); // Replace with your actual fetch logic

        if (user) {
          setLoggedInUser(user);
        } 
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchLoggedInUser();
  }, []);

  useEffect(() => {
    ws = new WebSocket(webSocketUrl);
    setWSRabbitMQ(ws);

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      ws.close();
      console.log('RabbitMQ WebSocket disconnected');
    };
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser, wsRabbitMQ }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}