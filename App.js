import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import SignInScreen from './screens/SignInScreen';
import WIPScreen from './screens/WIPScreen';
import SignUpScreen from './screens/SignUpScreen';
import ExampleScreen from './screens/ExampleScreen';
import TweetScreen from './screens/TweetScreen';
import NewTweetScreen from './screens/NewTweetScreen';
import ProfileScreen from './screens/ProfileScreen';
import { withLayoutContext } from 'expo-router';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="WIP" component={WIPScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Example" component={ExampleScreen} />
      <Stack.Screen name="TweetScreen" component={TweetScreen} />
      <Stack.Screen name="NewTweetScreen" component={NewTweetScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="SignIn" component={SignInScreen} />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator>
        <Drawer.Screen name="HomeSignIn" component={DrawerNavigator} />
        <Drawer.Screen name="OtherScreens" component={StackNavigator} />
        <Drawer.Screen name="Example" component={ExampleScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default App;

