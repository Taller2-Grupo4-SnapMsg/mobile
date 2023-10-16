import { StyleSheet, FlatList, View, Pressable, RefreshControl} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import Post from "../../components/Post";
import { useColorScheme } from 'react-native';
import React, {useState, useEffect} from 'react'; 
import Spinner from 'react-native-loading-spinner-overlay';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import getPosts from "../../handlers/posts/getPosts"
import { throwIfAudioIsDisabled } from "expo-av/build/Audio/AudioAvailability";

AMOUNT_POST = 3

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
}

export default function Home({}) {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [isStarting, setIsStarting] = useState(false);
  const [latestDate, setLatestDate] = useState(formatDate(new Date()));


  const handlePressPlus = () => {
    navigation.navigate('NewPost');
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const fetchedPosts = await getPosts(formatDate(new Date()), AMOUNT_POST);
      setPosts(fetchedPosts);
      setLatestDate(formatDate(posts[posts.length - 1].posted_at))
    } catch (error) {
      console.error('Error while loading posts:', error);
    } finally {
      setRefreshing(false);
      setStarting(false);
    }
  };

  const handleGetMorePosts = async () => {
    try {
      const fetchedPosts = await getPosts(latestDate, AMOUNT_POST);
      setPosts(fetchedPosts);
      setLatestDate(formatDate(posts[posts.length - 1].posted_at))
    } catch (error) {
      console.error('Error while loading posts:', error);
    } finally {
      setStarting(false);
    }
  };

  const handleStarting = async () => {
    try {
      setIsStarting(true);
      const fetchedPosts = await getPosts(formatDate(new Date()), AMOUNT_POST);
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
      { <FlatList
        data={posts}
        renderItem={({ item }) => item && <Post post={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#947EB0']} // Customize the loading spinner color(s)
          />
        }
        onEndReached={handleGetMorePosts}  // Add this line to call handleGetMorePosts when reaching the end
        onEndReachedThreshold={0.1}  // Adjust the threshold as needed
      /> }
      <Pressable style={styles.floatingButton} onPress={handlePressPlus}>
        <Entypo
          name="plus"
          size={24}
          color="white"
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
