import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
const firebaseConfig = {
  apiKey: "AIzaSyARuKrnjKAJYpaeignDyU8q3Nkkw7T0kYc",
  authDomain: "snapmsg-a9735.firebaseapp.com",
  projectId: "snapmsg-a9735",
  storageBucket: "snapmsg-a9735.appspot.com",
  messagingSenderId: "992270592722",
  appId: "1:992270592722:android:0c7412aa28aecfd4515b0b"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
export {storage, auth};


