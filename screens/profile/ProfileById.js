/*import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import Profile from './Profile';
import getPostById from '../handlers/getPostById';
import Spinner from 'react-native-loading-spinner-overlay';
import getPostsByUserId from '../handlers/getPostsByUserId';

const ProfileById = () => {
  const route = useRoute();
  const [posts, setPosts] = useState(null);
  const [isFetchingPosts, setIsFetchingPosts] = useState(false);

  const { userId } = route.params;

  useEffect(() => {
    const fetchUserById = async () => {
      try {
        setIsFetchingPosts(true);
        const fetchedPost = await getUserById(userId);
        setPosts(fetchedPost);
      } catch (error) {
        console.error('Error while checking posts status:', error);
      } finally {
        setIsFetchingPosts(false);
      }
    };

    fetchUserById();
  }, []);

  //aca seguro hay que configurar que ante un reloading lo actualice
  //va a ser idem home pero con los de un usuario
  useEffect(() => {
    const fetchPostsByUserId = async () => {
      try {
        setIsFetchingPosts(true);
        const fetchedPost = await getPostsByUserId(userId);
        setPosts(fetchedPost);
      } catch (error) {
        console.error('Error while checking posts status:', error);
      } finally {
        setIsFetchingPosts(false);
      }
    };

    fetchPostsByUserId();
  }, []);

  useEffect(() => {
    const fetchPostsByUserId = async () => {
      try {
        setIsFetchingPosts(true);
        const fetchedPost = await getPostsByUserId(userId);
        setPosts(fetchedPost);
      } catch (error) {
        console.error('Error while checking posts status:', error);
      } finally {
        setIsFetchingPosts(false);
      }
    };

    fetchPostsByUserId();
  }, []);

  if (isFetchingPosts) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isFetchingPosts}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  }

  return <ProfileUser user={user} posts={posts}/>;
};

export default ProfileById;*/