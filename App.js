import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import ExampleScreen from './ExampleScreen';
import WIPScreen from "./WIPScreen";
import CreateAccountScreen from "./CreateAccountScreen";
import SignInScreen from "./SignInScreen";

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Example" component={ExampleScreen} />
        <Stack.Screen name="WIP" component={WIPScreen} />
        <Stack.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
