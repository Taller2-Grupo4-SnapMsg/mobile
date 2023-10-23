import { StyleSheet, FlatList, View, Pressable, RefreshControl} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import Post from "../../components/posts/Post";
import Repost from "../../components/posts/Repost";
import { useColorScheme } from 'react-native';
import React, {useState, useEffect} from 'react'; 
import Spinner from 'react-native-loading-spinner-overlay';
import LoadingMoreIndicator from "../../components/LoadingMoreIndicator";
import AlertBottomBanner from "../../components/communicating_info/AlertBottomBanner";
import { useUser } from '../../contexts/UserContext';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';
import getPosts from "../../handlers/posts/getPosts"

AMOUNT_POST = 10

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
}

function removeMillisecondsFromDateStr(dateStr) {
  const parts = dateStr.split('.');
  if (parts.length === 2) {
    return parts[0];
  }
  return dateStr;
}

export default function Home({}) {
    //esta linea no va a ir, es solo para usar endpoint de profile
    const { loggedInUser } = useUser();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);
    const [posts, setPosts] = useState([]);
    const [isStarting, setIsStarting] = useState(true);
    const [latestDate, setLatestDate] = useState(new Date());
    const [loadingMore, setLoadingMore] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    const [alertMessageRepost, setMessageRepost] = useState('');
    const [alerMessageRepostColor, setMessageRepostColor] = useState(true);

    const handlePressPlus = () => {
      navigation.navigate('NewPost');
    };

    const handleRefresh = async () => {
      try {
        setReachedEnd(false);
        setRefreshing(true);
        const fetchedPosts = await getPosts(formatDate(new Date()), AMOUNT_POST, loggedInUser.email);
        if (fetchedPosts) {
          setPosts(fetchedPosts);
          setLatestDate(removeMillisecondsFromDateStr(fetchedPosts[fetchedPosts.length - 1].created_at));
        }
      } catch (error) {
        console.error('Error while loading posts:', error);
      } finally {
        setRefreshing(false);
      }
    };

    const handleGetMorePosts = async () => {
      if (loadingMore || reachedEnd) return;

      try {
        setLoadingMore(true);
        const fetchedPosts = await getPosts(removeMillisecondsFromDateStr(latestDate), AMOUNT_POST, loggedInUser.email);
        if (fetchedPosts.length > 0) {
          setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
          setLatestDate(removeMillisecondsFromDateStr(fetchedPosts[fetchedPosts.length - 1].created_at));
        } else {
          setReachedEnd(true);
        }
      } catch (error) {
        console.error('Error while loading more posts:', error);
      } finally {
        setLoadingMore(false);
      }
    };

    const handleStarting = async () => {
      try {
        setIsStarting(true);
        const fetchedPosts = await getPosts(formatDate(new Date()), AMOUNT_POST, loggedInUser.email);
        if (fetchedPosts.length > 0) {
          setPosts(fetchedPosts);
          setLatestDate(removeMillisecondsFromDateStr(fetchedPosts[fetchedPosts.length - 1].created_at));
        }
      } catch (error) {
        console.error('Error while loading posts:', error);
      } finally {
        setIsStarting(false);
      }
    }

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
        renderItem={({ item }) => {
          if (item.user_poster.email == item.user_creator.email) {
            return <Post post={item} setMessageRepost={setMessageRepost} setMessageRepostColor={setMessageRepostColor}/>;
          } else {
            return <Repost post={item} setMessageRepost={setMessageRepost} setMessageRepostColor={setMessageRepostColor}/>;
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#947EB0']}
          />
        }
        onEndReached={handleGetMorePosts}
        onEndReachedThreshold={0.1}
      />
      {loadingMore && <LoadingMoreIndicator />}
      <Pressable style={styles.floatingButton} onPress={handlePressPlus}>
        <Entypo
          name="plus"
          size={24}
          color="white"
        />
      </Pressable>
      {alertMessageRepost && (
          <AlertBottomBanner
            message={alertMessageRepost}
            backgroundColor={alerMessageRepostColor}
            timeout={TIMEOUT_ALERT}
          />
        )}
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
});
