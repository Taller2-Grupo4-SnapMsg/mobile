import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SignInScreen from './screens/SignInScreen';
import WIPScreen from './screens/WIPScreen';
import SignUpScreen from './screens/SignUpScreen';
import ExampleScreen from './screens/ExampleScreen';
import TweetScreen from './screens/TweetScreen';
import NewTweetScreen from './screens/NewTweetScreen';
import ProfileScreen from './screens/ProfileScreen';
import {
  SessionProvider,
  WithSession,
  WithoutSession,
} from './contexts/auth/Auth';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <Stack.Screen name="Example" component={ExampleScreen} />
      <Stack.Screen name="TweetScreen" component={TweetScreen} />
      <Stack.Screen name="NewTweetScreen" component={NewTweetScreen} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    </Stack.Navigator>
  );
};

const App = () => (
  <SessionProvider>
    <NavigationContainer>
    <WithSession>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={StackNavigator} />
          <Stack.Screen name="WIP (no va)" component={WIPScreen} />
          <Stack.Screen name="SignUp (no va)" component={SignUpScreen} />
          <Stack.Screen name="Sign In (no va)" component={SignInScreen} />
          <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
        </Drawer.Navigator>
    </WithSession>
    <WithoutSession>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="ExampleScreen" component={MainNavigator} />
      </Stack.Navigator>
    </WithoutSession>
    </NavigationContainer>
  </SessionProvider>
);

const MainNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={StackNavigator} />
    {/*<Drawer.Screen name="WIP (no va)" component={WIPScreen} />*/}
    {/*<Drawer.Screen name="SignUp (no va)" component={SignUpScreen} />*/}
    {/*<Drawer.Screen name="ProfileScreen" component={ProfileScreen} />*/}
  </Drawer.Navigator>
);

export default App;


