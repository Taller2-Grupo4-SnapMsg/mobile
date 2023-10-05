import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignInScreen from './screens/signIn/SignInScreen';
import SignUpScreen from './screens/signUp/SignUpScreen';
import Home from './screens/home/Home';
import TweetById from './screens/home/TweetById';
import NewTweet from './screens/home/NewTweet';
import Profile from './screens/profile/Profile';
import EditProfile from './screens/profile/EditProfile';
import FollowingsList from './screens/profile/FollowingsList';
import FollowersList from './screens/profile/FollowersList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

// Import the UserProvider
import { UserProvider, useUser } from './UserContext'; // Import useUser hook

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InHome" component={Home} />
      <Stack.Screen name="TweetById" component={TweetById} />
      <Stack.Screen name="NewTweet" component={NewTweet} />
    </Stack.Navigator>
  );
};

const StackNavigatorProfile = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="InProfile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="FollowingsList" component={FollowingsList} />
      <Stack.Screen name="FollowersList" component={FollowersList} />
    </Stack.Navigator>
  );
};

export default function App() {
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

  if (token === undefined) {
    // Loading state while checking for the token
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={true}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  }

  return (
    <UserProvider>
      <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {token ? (
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={StackNavigator} />
            <Drawer.Screen name="Profile" component={StackNavigatorProfile} />
          </Drawer.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={StackNavigator} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </UserProvider>
  );
};
