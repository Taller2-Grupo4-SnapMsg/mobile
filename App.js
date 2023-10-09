import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createSwitchNavigator } from 'react-navigation';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';

import SignInScreen from './screens/signIn/SignInScreen';
import SignUpScreen from './screens/signUp/SignUpScreen';
import Home from './screens/home/Home';
import TweetById from './components/TweetById';
import NewTweet from './screens/newTweet/NewTweet';
import Profile from './screens/profile/Profile';
import EditProfile from './screens/profile/EditProfile';
import FollowingsList from './screens/profile/FollowingsList';
import FollowersList from './screens/profile/FollowersList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { View } from 'react-native';
import Spinner from 'react-native-loading-spinner-overlay';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { UserProvider} from './contexts/UserContext';
import { PostProvider} from './contexts/PostContext';

const Stack = createStackNavigator();
const Switch = createSwitchNavigator();
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
      <Stack.Screen name="TweetById" component={TweetById} />
      <Stack.Screen name="FollowingsList" component={FollowingsList} />
      <Stack.Screen name="FollowersList" component={FollowersList} />
    </Stack.Navigator>
  );
};

const CustomDrawerContent = (props) => {
  const { navigation } = props;

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
  
      if (token !== null)
        await AsyncStorage.removeItem('token');
        token = await AsyncStorage.getItem('token');
        if (token == null)
          console.log('El token se encontro inicialmente, luego se borro, y ahora no se encuentra. Bien!')
      else 
        console.log('Token not found.');
      
    } catch (error) {
      console.error('Error checking and deleting token:', error);
    }
    navigation.navigate('SignIn');
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={() => handleLogout()}
      />
    </DrawerContentScrollView>
  );
};

const MainNavigator = () => {
  const navigation = useNavigation();
  const handleNavigateToRoute = () => {
    navigation.navigate('Sign Out'); // Reemplaza 'NombreDeTuRuta' con el nombre de la ruta a la que deseas navegar
  };

  return (
    <Drawer.Navigator 
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Home" component={StackNavigator} />
      <Drawer.Screen name="Profile" component={StackNavigatorProfile} />
    </Drawer.Navigator>
  );
};


const AuthStack = () => (
  <Stack.Navigator initialRouteName="SignIn" headerMode="none">
    <Stack.Screen name="SignIn" component={SignInScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const AppStack = ({ navigation }) => (
  <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
    <Drawer.Screen name="Home" component={HomeScreen} />
  </Drawer.Navigator>
);


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
      <PostProvider>
      {/* <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {token ? (
            <MainNavigator />
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="Home" component={MainNavigator} />
          </Stack.Navigator>
        )}
      </NavigationContainer> */}
      
        <NavigationContainer theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Switch.Navigator>
          {token ? (
            <Switch.Screen name="AppStack">
              {() => <AppStack />}
            </Switch.Screen>
          ) : (
            <Switch.Screen name="AuthStack" component={AuthStack} />
          )}
         </Switch.Navigator>
        </NavigationContainer>
      </PostProvider>
    </UserProvider>
  );
};



//en App
