import { useState, useEffect, useRef } from 'react';
import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// import { AppRegistry } from 'react-native';
// import messaging from '@react-native-firebase/messaging';
// import { initializeApp } from '@react-native-firebase/app';
// import Constants from 'expo-constants';
//import { projectId } from './firebase';

const appConfig = require('./app.json')
const projectId = appConfig?.expo?.extra?.eas?.projectId;

//const admin = require('firebase-admin');
// const serviceAccount = require('./snapmsg-a9735-firebase-adminsdk-fmepd-89e8ef4441.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://snapmsg-a9735-default-rtdb.firebaseio.com"
// });

// const firebaseConfig = {
//   apiKey: "AIzaSyARuKrnjKAJYpaeignDyU8q3Nkkw7T0kYc",
//   authDomain: "snapmsg-a9735.firebaseapp.com",
//   projectId: "snapmsg-a9735",
//   storageBucket: "snapmsg-a9735.appspot.com",
//   messagingSenderId: "992270592722",
//   appId: "1:992270592722:android:0c7412aa28aecfd4515b0b"
// };

// Inicializa Firebase
//initializeApp(firebaseConfig);

// Escucha las notificaciones push
// messaging()
//   .onNotificationOpenedApp((remoteMessage) => {
//     // Maneja la notificación cuando la aplicación está abierta
//     console.log('Notificación abierta:', remoteMessage);
//   });

// Registra la aplicación
//AppRegistry.registerComponent('awesomeproject', () => App);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

//deberia hacer un fetch a la bdd ver si tiene token y si no tiene, 
//generar uno y guardarlo
async function registerForPushNotificationsAsync() {
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
    console.log(projectId)
    token = (await Notifications.getExpoPushTokenAsync({ projectId })).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    to: "e0ebae00-8a3b-4632-8f56-d193330d6aa4",
    content: {
      title: "mensaje para martin! 📬",
      body: 'hola pibe',
      data: { data: 'aaaa' },
    },
    trigger: { seconds: 0 }, //en cuanto se dispara la notificacion
  });
}

// const message = {
//   notification: {
//     title: 'Título de la notificación',
//     body: 'Cuerpo de la notificación',
//   },
//   token: 'ExponentPushToken[bhFOjeJADEUXSb66G_a6Ad]', // El token del usuario
// };

// admin.messaging().send(message)
//   .then((response) => {
//     console.log('Notificación enviada exitosamente:', response);
//   })
//   .catch((error) => {
//     console.log('Error al enviar la notificación:', error);
//   });


export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

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

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-around',
      }}>
      <Text>Your expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Title: {notification && notification.request.content.title} </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
      </View>
      <Button
        title="Press to schedule a notification"
        onPress={async () => {
          await schedulePushNotification();
        }}
      />
    </View>
  );
}




