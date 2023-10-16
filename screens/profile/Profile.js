import React, { useEffect, useState } from 'react';
import { useColorScheme, FlatList, Pressable } from 'react-native';
import getFollowersByUsername from '../../handlers/profile/getFollowersByUsername';
import getFollowingByUsername from '../../handlers/profile/getFollowingByUsername';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import ProfilePicture from '../../components/ProfilePicture';
import ProfilePictureModal from '../../components/ProfilePictureModal';
import EditProfileButton from '../../components/EditProfileButton';
import ProfileStats from '../../components/ProfileStats';
import ProfileExtraInfo from '../../components/ProfileExtraInfo';
import { useRoute } from '@react-navigation/native';
import followUser from '../../handlers/followUser';
import unfollowUser from '../../handlers/unfollowUser';
import checkIfFollowing from '../../handlers/profile/checkIfFollowing';
import FollowButton from '../../components/FollowButton';
import { Entypo } from '@expo/vector-icons';
import Tweet from '../../components/Tweet';
import { usePost } from '../../contexts/PostContext';
import { useUser } from '../../contexts/UserContext';
import getPostsByToken from '../../handlers/profile/getPostsByToken';
import ProfileUser from './ProfileUser';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider
} from '@react-navigation/native';


export default function Profile() {
  const { loggedInUser } = useUser();
  const { posts } = usePost();
  const route = useRoute();
  const { user_param } = route.params || {};
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { postsChanged, setPostsChanged } = usePost();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && Object.keys(user_param).length !== 0) {
          setUser(user_param);
        } else {
          setUser(loggedInUser);
        }
        setIsLoading(false);
        
        //setPostsChanged(true);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [loggedInUser, user_param]);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isLoading}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  }
  return <ProfileUser user={user} posts={posts}/>;
}

