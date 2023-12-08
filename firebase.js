import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase, ref } from "firebase/database";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyDPuhI19z9EqwQtEznImrJ2PI2T4VUKhuU",
  authDomain: "prueba-4b5d1.firebaseapp.com",
  projectId: "prueba-4b5d1",
  storageBucket: "prueba-4b5d1.appspot.com",
  //messagingSenderId: "992270592722",
  appId: "1:790963712995:android:1fc65d2d66f08fc1d0a6d6",
  databaseURL: "https://prueba-4b5d1-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
const db = getDatabase(app);
export {storage, auth, db};
