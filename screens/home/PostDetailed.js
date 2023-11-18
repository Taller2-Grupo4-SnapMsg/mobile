import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Post from '../../components/posts/Post';
import getPostById from '../../handlers/posts/getPostById';
import Spinner from 'react-native-loading-spinner-overlay';

const PostDetailed = ({ route }) => {
  const post_id = route.params.post_id;
  const [post, setPost] = useState(null);
  const [isFetchingPost, setIsFetchingPost] = useState(false);
  
  useEffect(() => {
    const fetchPostById = async () => {
      try {
        setIsFetchingPost(true);
        const fetchedPost = await getPostById(post_id);
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
  if (post){
    return <Post post={post[0]}/>
  }
};

export default PostDetailed;