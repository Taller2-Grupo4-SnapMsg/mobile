import { StyleSheet, FlatList, View, Pressable, RefreshControl} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import tweets from "../../assets/data/tweets";
import Tweet from "../../components/Tweet";
import { useColorScheme } from 'react-native';
import React, {useState, useEffect} from 'react'; 
import Spinner from 'react-native-loading-spinner-overlay';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import getPosts from "../../handlers/feed/getPosts"
import { throwIfAudioIsDisabled } from "expo-av/build/Audio/AudioAvailability";


export default function Home({}) {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  const handlePress = () => {
    navigation.navigate('NewTweet');
  };

  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error while loading posts:', error);
    } finally {
      setIsRefreshing(false);
      setStarting(false);
    }
  };

  const handleStarting = async () => {
    try {
      setIsStarting(true);
      const fetchedPosts = await getPosts();
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error while loading posts:', error);
    } finally {
      setIsStarting(false);
    }
  };
 
  useEffect(() => {
    handleStarting();
  }, []);

   return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <View style={styles.container}>
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isStarting}
          textStyle={{ color: '#FFF' }}
        />
      </View>
      <FlatList
        data={posts}
        renderItem={({ item }) => item && <Tweet tweet={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#947EB0']} // Customize the loading spinner color(s)
          />
        }
      />
      <Pressable style={styles.floatingButton} onPress={handlePress}>
        <Entypo
          name="plus"
          size={24}
          color="white"
        />
      </Pressable>
      <Pressable style={styles.floatingButton} onPress={handlePress}>
        <Entypo
          name="minus"
          size={24}
          //color="white"
        />
      </Pressable>
    </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  },
  floatingButton: {
    backgroundColor: '#947EB0',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    bottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonIcon: {
    //color: 'white',
  },
});
