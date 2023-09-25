import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignInScreen from './screens/signIn/SignInScreen';
import SignUpScreen from './screens/signUp/SignUpScreen';
import Home from './screens/home/Home';
import TweetById from './screens/home/TweetById';
import NewTweet from './screens/home/NewTweet';
import ProfileById from './screens/profile/ProfileById';
import Profile from './screens/profile/Profile';
import EditProfileById from './screens/profile/EditProfileById';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import { useColorScheme } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import users from './assets/data/users'

const userHarcodeado = users[2];

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();


const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="InHome" component={Home} />
      <Stack.Screen name="TweetById" component={TweetById} />
      <Stack.Screen name="NewTweet" component={NewTweet} />
      <Stack.Screen name="ProfileById" component={ProfileById} />
    </Stack.Navigator>
  );
};


const StackNavigatorProfile = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="InProfile" component={Profile} />
      <Stack.Screen name="EditProfileById" component={EditProfileById} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={StackNavigator} />
    <Drawer.Screen
      name="Profile"
      component={StackNavigatorProfile}
    />
  </Drawer.Navigator>
);


const App = () => {
  const [token, setToken] = useState();
  const colorScheme = useColorScheme();

  useEffect(() => {
    const getToken = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            setToken(storedToken);
        } catch (error) {
            console.error('Error al recuperar el token:', error);
        }
    };
    getToken();
  }, []);

  console.log(token)

  return(
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
      <NavigationContainer>
          {/*{token && (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="Main" component={MainNavigator} />
            </Stack.Navigator>
          )}
          {!token && (
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen name="Main" component={MainNavigator} />
            </Stack.Navigator>
          )}*/}
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Main" component={MainNavigator} />
          </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
};

export default App;

