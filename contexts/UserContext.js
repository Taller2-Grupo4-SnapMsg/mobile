// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import getUserByToken from '../handlers/getUserByToken';
const UserContext = createContext();

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
      console.log(token);
      await SaveTokenDevice(token);
    } else {
      alert('Must use physical device for Push Notifications');
    }
  }

  useEffect(() => {
    //esto no lo deberia hacer siempre
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
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