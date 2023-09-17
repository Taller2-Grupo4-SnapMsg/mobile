import React from 'react';
import { LocationProvider } from 'expo-router'; // Import LocationProvider
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen'
import WIPScreen from "./screens/WIPScreen";
import SignUpScreen from './screens/SignUpScreen';
import SignInScreen from "./screens/SignInScreen";
import ExampleScreen from "./screens/ExampleScreen";
import TweetScreen from  "./screens/TweetScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <LocationProvider> // Add LocationProvider
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="WIP" component={WIPScreen} />
          <Stack.Screen name="Sign Up" component={SignUpScreen} />
          <Stack.Screen name="Sign In" component={SignInScreen} />
          <Stack.Screen name="Example" component={ExampleScreen} />
          <Stack.Screen name="TweetScreen" component={TweetScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
};

export default App;
