import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import Post from '../../components/posts/Post';
import getPostById from '../../handlers/posts/getPostById';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';

const PostDetailed = ({ route }) => {
  const post_id = route.params.post_id;
  const [refreshing, setRefreshing] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alerMessageColor, setAlertMessageColor] = useState(true);
  const [post, setPost] = useState(null);
  const [isFetchingPost, setIsFetchingPost] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchPostById = async () => {
      try {
        setIsFetchingPost(true);
        const fetchedPost = await getPostById(post_id, navigation);
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
    return <Post post={post[0]} setAlertMessage={setAlertMessage} setAlertMessageColor={setAlertMessageColor} setRefreshing={setRefreshing}/>
  }
};

export default PostDetailed;