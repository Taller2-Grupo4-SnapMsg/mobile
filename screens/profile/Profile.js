import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import getFollowersByUsername from '../../handlers/getFollowersByUsername';
import getFollowingByUsername from '../../handlers/getFollowingByUsername';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import followUser from '../../handlers/followUser';
import unfollowUser from '../../handlers/unfollowUser';
import { fetchFollowsCount } from '../../functions/Fetchings/fetchFollowsCount';
import { fetchFollowStatus } from '../../functions/Fetchings/fetchFollowStatus';
import checkIfFollowing from '../../handlers/checkIfFollowing';
import checkIfFollower from '../../handlers/checkIfFollower';
import ProfileBanner from '../../components/ProfileBanner';
import {
  View,
} from 'react-native';

import { useUser } from '../../UserContext';



export default function Profile() {
  const { loggedInUser } = useUser();
  const route = useRoute();
  const { user_param } = route.params || {};
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && Object.keys(user_param).length !== 0) {
          setUser(user_param);
        } else {
          setUser(loggedInUser);
        }
        setIsLoading(false);
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
  return <ProfileUser user={user} />;
}



function ProfileUser({ user }) {
  const { loggedInUser } = useUser(); 
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);
  const [isFollower, setIsFollower] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useFocusEffect( 
    React.useCallback(() => {
      fetchFollowsCount({ user, setFollowsCount: setFollowers, followsFunction: getFollowersByUsername });
      fetchFollowsCount({ user, setFollowsCount: setFollowing, followsFunction: getFollowingByUsername });
    }, [user])
  );

  const handleEditButton = () => {
    navigation.push('EditProfile', { user: user });
  };

  const handleFollowersButton = () => {
    if (isFollowing && isFollower || (user && loggedInUser && user.email === loggedInUser.email)) {
      navigation.push('FollowersList', { user: user });
    }
  };

  const handleFollowingButton = () => {
    if (isFollowing && isFollower|| (user && loggedInUser && user.email === loggedInUser.email)) {
      navigation.push('FollowingsList', { user: user });
    }
  };

  const handleFollowButton = async () => {
    setIsFetching(true); 
  
    if (isFollowing) {
      await unfollowUser(user.email);
    } else {
      await followUser(user.email);
    }
  
    setIsFollowing(!isFollowing);
    fetchFollowsCount({ user, setFollowsCount: setFollowers, followsFunction: getFollowersByUsername });
    fetchFollowsCount({ user, setFollowsCount: setFollowing, followsFunction: getFollowingByUsername });
  
    setIsFetching(false); 
  };

  useEffect(() => {  
    fetchFollowStatus({ user, setStatus: setIsFollowing, followStatusFunction: checkIfFollowing, setIsFetching });
    fetchFollowStatus({ user, setStatus: setIsFollower, followStatusFunction: checkIfFollower, setIsFetching });
  }, [user]);
  

  return (
    <ProfileBanner user={user} isFollowing={isFollowing} isFollower={isFollower} 
    isFetching={isFetching} toggleModal={toggleModal} handleEditButton={handleEditButton} 
    handleFollowersButton={handleFollowersButton} handleFollowingButton={handleFollowingButton}
    handleFollowButton={handleFollowButton} followers={followers} following={following} isModalVisible={isModalVisible} />
  );
}
