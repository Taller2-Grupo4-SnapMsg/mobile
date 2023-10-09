import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Tweet from './Tweet';
import getPostById from '../handlers/getPostById';
import Spinner from 'react-native-loading-spinner-overlay';

const TweetById = () => {
  const route = useRoute();
  const [post, setPost] = useState(null);
  const [isFetchingPost, setIsFetchingPost] = useState(false);

  const { tweetId } = route.params;

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        setIsFetchingPost(true);
        const fetchedPost = await getPostById(tweetId);
        setPost(fetchedPost);
      } catch (error) {
        console.error('Error while checking posts status:', error);
      } finally {
        setIsFetchingPost(false);
      }
    };

    fetchPostById();
  }, []);

  if (isFetchingPost) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isFetchingPost}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  }

  return <Tweet tweet={post} />;
};

export default TweetById;
