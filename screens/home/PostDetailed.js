import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Post from '../../components/Post';
import getPostById from '../../handlers/posts/getPostById';
import Spinner from 'react-native-loading-spinner-overlay';

const PostDetailed = () => {
  const route = useRoute();
  const [post, setPost] = useState(null);
  const [isFetchingPost, setIsFetchingPost] = useState(false);

  const { postId } = route.params;

  useEffect(() => {
    const fetchPostById = async () => {
      try {
        setIsFetchingPost(true);
        const fetchedPost = await getPostById(postId);
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

  return <Post post={post} />;
};

export default PostDetailed;