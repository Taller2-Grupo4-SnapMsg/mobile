import { StyleSheet, FlatList, View, Pressable, RefreshControl} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import Post from "../../components/posts/Post";
import Repost from "../../components/posts/Repost";
import { useColorScheme } from 'react-native';
import React, {useState, useEffect} from 'react'; 
import LoadingMoreIndicator from "../../components/LoadingMoreIndicator";
import AlertBottomBanner from "../../components/communicating_info/AlertBottomBanner";
import { useUser } from '../../contexts/UserContext';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';
import getPosts from "../../handlers/posts/getPosts"
import { useFocusEffect } from "expo-router";

AMOUNT_POST = 6

function formatDate(date) {
  return date.replace("T", "_").split(".")[0];
}

export default function Home({}) {
    //esta linea no va a ir, es solo para usar endpoint de profile
    const { loggedInUser } = useUser();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [postsFeed, setPostsFeed] = useState([]);
    const [latestDate, setLatestDate] = useState(new Date());
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    const [alertMessageRepost, setAlertMessage] = useState('');
    const [alerMessageRepostColor, setAlertMessageColor] = useState(true);

    const handlePressPlus = () => {
      navigation.navigate('NewPost');
    };

    const handlePressUserPlus = () => {
      navigation.navigate('User Recommendation');
    };


    const handleGetMorePosts = async (date, refresh) => {
      if (loadingMore || (reachedEnd && !refresh)) return;
    
      try {
        setLoadingMore(true);
        setRefreshing(refresh);
    
        const fetchedPosts = await getPosts(formatDate(date), AMOUNT_POST, loggedInUser.email, navigation);
    
        if (fetchedPosts && fetchedPosts.length > 0) {
          if (refresh) {
            setPostsFeed(fetchedPosts);
            setRefreshing(false);
            setReachedEnd(false);
          } else {
            setPostsFeed((prevPosts) => [...prevPosts, ...fetchedPosts]);
          }
          setLatestDate(fetchedPosts[fetchedPosts.length - 1].created_at);
        } else {
          setReachedEnd(true);
        }
      } catch (error) {
        console.error('Error while loading more posts:', error);
      } finally {
        setLoadingMore(false);
      }
    };

    useFocusEffect(
      React.useCallback(() => {
        handleGetMorePosts((new Date()).toISOString(), true);
      }, [])
    );

   return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <View style={styles.container}>
      <FlatList
        data={postsFeed}
        renderItem={({ item }) => {
          if (item.user_poster.email == item.user_creator.email) {
            return <Post post={item} setAlertMessage={setAlertMessage} setAlertMessageColor={setAlertMessageColor}/>;
          } else {
            return <Repost post={item} setAlertMessage={setAlertMessage} setAlertMessageColor={setAlertMessageColor}/>;
          }
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleGetMorePosts((new Date()).toISOString(), true)}
            colors={['#947EB0']}
          />
        }
        onEndReached={() => handleGetMorePosts(latestDate, false)}
        onEndReachedThreshold={0.3}
        />
      {loadingMore && <LoadingMoreIndicator />}
      <Pressable style={styles.floatingButton} onPress={handlePressPlus}>
        <Entypo
          name="plus"
          size={24}
          color="white"
        />
      </Pressable>
      <Pressable style={styles.buttonRecommendedUser} onPress={handlePressUserPlus}>
        <View style={styles.iconcontainer}>
          <Entypo name="add-user" size={24} color="white" />
        </View>
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
  buttonRecommendedUser: {
    backgroundColor: '#6B5A8E',
    borderRadius: 20,
    width: 60,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    top: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  iconcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
