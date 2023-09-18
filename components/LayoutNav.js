import FontAwesome from '@expo/vector-icons/FontAwesome';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';


export default function RootLayoutNav() {
    const colorScheme = useColorScheme();
  
    return (
      <>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Sign Up" component={SignUpScreen} />
            <Stack.Screen name="NewTweetScreen" component={NewTweetScreen} />
          </Stack>
        </ThemeProvider>
      </>
    );
  }