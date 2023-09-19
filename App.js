import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/tests/Test';
import SignInScreen from './screens/signIn/SignInScreen';
import WIPScreen from './screens/tests/WIPScreen';
import SignUpScreen from './screens/signUp/SignUpScreen';
import Home from './screens/home/Home';
import TweetById from './screens/home/TweetById';
import NewTweet from './screens/home/NewTweet';
import ProfileById from './screens/profile/Profile';
import { useColorScheme } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { withLayoutContext } from 'expo-router';
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
      <Stack.Screen name="InHome" component={Home} />
      <Stack.Screen name="TweetById" component={TweetById} />
      <Stack.Screen name="NewTweet" component={NewTweet} />
      <Stack.Screen name="ProfileById" component={ProfileById} />
    </Stack.Navigator>
  );
};

const App = () => {
  const colorScheme = useColorScheme();

  return(
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <SessionProvider>
      <NavigationContainer>
      <WithSession>
          <Drawer.Navigator initialRouteName="Home">
            <Drawer.Screen name="Home" component={StackNavigator} />
            {/*<Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="WIP (no va)" component={WIPScreen} />
            <Stack.Screen name="SignUp (no va)" component={SignUpScreen} />
            <Stack.Screen name="Sign In (no va)" component={SignInScreen} />*/}
          </Drawer.Navigator>
      </WithSession>
      <WithoutSession>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="Main" component={MainNavigator} />
        </Stack.Navigator>
      </WithoutSession>
      </NavigationContainer>
    </SessionProvider>
    </ThemeProvider>
  );
};

const MainNavigator = () => (
  <Drawer.Navigator initialRouteName="Home">
    <Drawer.Screen name="Home" component={StackNavigator} />
    {/*<Drawer.Screen name="WIP (no va)" component={WIPScreen} />*/}
    {/*<Drawer.Screen name="SignUp (no va)" component={SignUpScreen} />*/}
    {/*<Drawer.Screen name="ProfileScreen" component={ProfileScreen} />*/}
  </Drawer.Navigator>
);

export default App;

