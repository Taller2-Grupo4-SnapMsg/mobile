// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import getUserByToken from '../handlers/getUserByToken';
const UserContext = createContext();
import { db } from '../firebase';
import { ref, set, get } from 'firebase/database';

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import SaveTokenDevice from '../handlers/notifications/saveTokenDevice';
import SendNotification from '../handlers/notifications/sendNotification';

import { useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';

const appConfig = require('../app.json')
const projectId = appConfig?.expo?.extra?.eas?.projectId;

export function UserProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [notificationReceived, setNotificationReceived] = useState(false);

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

  function generateNotificationID(chatID, time) {
    const sanitizedChatID = chatID.replace(/[\.\#\$\/\[\]]/g, '_');
    return `${sanitizedChatID}_${time.toString()}`;
  }
  

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      const identifier = notification.request.identifier;

      console.log("ENTRA A VER LA NOTIFICACION DE MENSAJE")
      const route = notification.request.content.data.route;
      if (route === "message") {
        //const chatID = notification.request.content.data.chatID;
        const user1 = notification.request.content.data.user1;
        const imageUrl = notification.request.content.data.imagenUrl;
        //const user2 = notification.request.content.data.user2;
        const newNotif = {
          type: 'message',
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
          timestamp: Date.now(),
          read: false,
        };
        //const notificationId = generateNotificationID(user1, Date.now());
        const notificationId = identifier;
        const notifRef = ref(db, `notifications/${notificationId}`);

        get(notifRef)
          .then(() => {
              set(notifRef, {
                notificationId,
                ...newNotif,
              }).catch((error) => {
                console.log("hubo un error al crear la notificacion!!");
              });
            }
          );
  
        setNotificationReceived(true);
      }
  
      if (route === 'mention') {
        const post_id = notification.request.content.data.post_id;
        const newNotif = {
          type: 'mention',
          title: notification.request.content.title,
          body: notification.request.content.body,
          data: notification.request.content.data,
          timestamp: Date.now(),
          read: false,
        };
  
        //const notificationId = generateNotificationID(post_id, Date.now());
        const notificationId = identifier;
        const notifRef = ref(db, `notifications/${notificationId}`);

        get(notifRef)
          .then(() => {
              set(notifRef, {
                notificationId,
                ...newNotif,
              }).catch((error) => {
                console.log("hubo un error al crear la notificacion!!");
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
        // Fetch the user here, e.g., using an API call or AsyncStorage
        const user = await getUserByToken(); // Replace with your actual fetch logic

        // Set the loggedInUser if the user is fetched successfully
        if (user) {
          setLoggedInUser(user);
        } 
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    // Call the fetchLoggedInUser function when the component mounts
    fetchLoggedInUser();
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}