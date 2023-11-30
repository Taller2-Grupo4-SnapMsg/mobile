import { StyleSheet, FlatList, Text, View, Pressable, RefreshControl} from "react-native";
import { useNavigation } from '@react-navigation/native';
import Post from "../../../components/posts/Post";
import Repost from "../../../components/posts/Repost";
import { useColorScheme } from 'react-native';
import React, {useState, useEffect} from 'react';
import getPostsOnATrendingTopic from "../../../handlers/trending_topics/getPostsOnATrendingTopic"; 
import LoadingMoreIndicator from "../../../components/LoadingMoreIndicator";
import { useUser } from '../../../contexts/UserContext';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';

AMOUNT_POST_TRENDING = 10

export default function TrendingTopicDetail({ route }) {
    const { trending_topic } = route.params;
    const { loggedInUser } = useUser();
    const colorScheme = useColorScheme();
    const [posts, setPosts] = useState([]);
    const [offset, setOffset] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);
    const [alertMessageRepost, setAlertMessage] = useState('');
    const [alerMessageRepostColor, setAlertMessageColor] = useState(true);
    const navigation = useNavigation();

    const handleGetMorePosts = async (offset, refresh) => {
        if (loadingMore || (reachedEnd && !refresh)) return;
        
        try {
            setLoadingMore(true);
            setRefreshing(refresh);
        
            const fetched = await getPostsOnATrendingTopic(trending_topic, AMOUNT_POST_TRENDING, offset, navigation);

            if (fetched && fetched.length > 0) {
              if (refresh) {
                  setPosts(fetched);
                  setRefreshing(false);
                  setReachedEnd(false);
              } else {
                  setPosts((prevPosts) => [...prevPosts, ...fetched]);
              }
              setOffset(offset + AMOUNT_POST_TRENDING);
            } else {
              setReachedEnd(true);
            }
        } catch (error) {
            console.error('Error while loading more trending topics:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    useEffect(() => {  
      handleGetMorePosts(0, true)
     }, []);

   return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <View style={styles.container}>
      <FlatList
        data={posts}
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
            onRefresh={() => handleGetMorePosts(0, true)}
            colors={['#947EB0']}
          />
        }
        onEndReached={() => handleGetMorePosts(offset, false)}
        onEndReachedThreshold={0.1}
        />
      {loadingMore && <LoadingMoreIndicator />}
    </View>
    </ThemeProvider>
   );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  },
  iconcontainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  introText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
    color: '#6B5A8E',
  },
  introcontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconContainer: {
    marginRight: 16,
  },
  hashtag: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B5A8E',
  },
  text: {
    fontSize: 24,
    color: '#6B5A8E',
  },
});