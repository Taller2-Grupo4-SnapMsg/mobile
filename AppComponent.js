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
import Interests from './screens/signUp/Interests';
import SearchUser from './screens/search/SearchUser';

import { useColorScheme } from 'react-native';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';

import { useUser } from './UserContext';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="TweetById" component={TweetById} />
      <Stack.Screen name="NewTweet" component={NewTweet} />
    </Stack.Navigator>
  );
};

const StackNavigatorProfile = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="FollowingsList" component={FollowingsList} />
      <Stack.Screen name="FollowersList" component={FollowersList} />
    </Stack.Navigator>
  );
};

const StackNavigatorSearch = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchUser" component={SearchUser} />
      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="FollowingsList" component={FollowingsList} />
      <Stack.Screen name="FollowersList" component={FollowersList} />
    </Stack.Navigator>
  );
}

export default function AppComponent() {
  const colorScheme = useColorScheme();
  const {loggedInUser} = useUser(); 
  return (
    <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    {/*  {loggedInUser ? (
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="InHome" component={StackNavigator} options={{ title: 'Home' }} />
          <Drawer.Screen name="ProfileDetail" component={StackNavigatorProfile} options={{ title: 'Profile' }} />
          <Drawer.Screen name="SearchUserScreen" component={StackNavigatorSearch} options={{ title: 'Search' }} />
        </Drawer.Navigator>
    ) : (*/}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Interests" component={Interests} />
          <Stack.Screen name="Home" options={{ title: 'Home' }}>
            {() => (
              <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="InHome" component={StackNavigator}  options={{ title: 'Home' }} />
                <Drawer.Screen name="ProfileDetail" component={StackNavigatorProfile}  options={{ title: 'Profile' }} />
                <Drawer.Screen name="SearchUser" component={StackNavigatorSearch} options={{ title: 'Search' }} />
              </Drawer.Navigator>
            )}
          </Stack.Screen>
        </Stack.Navigator>
      
    </NavigationContainer>
  );

};
