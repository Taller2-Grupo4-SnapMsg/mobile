import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import getUserByToken from '../../handlers/getUserByToken';
import getFollowersByUsername from '../../handlers/getFollowersByUsername';
import getFollowingByUsername from '../../handlers/getFollowingByUsername';
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
import checkIfFollowing from '../../handlers/checkIfFollowing';
import FollowButton from '../../components/FollowButton';
import checkIfFollower from '../../handlers/checkIfFollower';

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
// Import the UserProvider

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
        // Fetch the logged-in user regardless of user_param
        if (route.params && Object.keys(user_param).length !== 0) {
          console.log('user_param', user_param);
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
  const { loggedInUser } = useUser(); // Use the hook to access loggedInUser
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

  const fetchFollowersCount = async () => {
    try {
      const fetchedFollowers = await getFollowersByUsername(user.email);
      setFollowers(fetchedFollowers);
    } catch (error) {
      console.error('Error al obtener los followers:', error);
    }
  };

  const fetchFollowingCount = async () => {
    try {
      const fetchedFollowing = await getFollowingByUsername(user.email);
      setFollowing(fetchedFollowing);
    } catch (error) {
      console.error('Error al obtener los followings:', error);
    }
  };

  useFocusEffect( 
    React.useCallback(() => {
      fetchFollowersCount();
      fetchFollowingCount();
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
    setIsFetching(true); // Set isFetching to true when you start the action
  
    if (isFollowing) {
      await unfollowUser(user.email);
    } else {
      await followUser(user.email);
    }
  
    setIsFollowing(!isFollowing);
    fetchFollowersCount();
    fetchFollowingCount();
  
    setIsFetching(false); // Set isFetching back to false after completing the action
  };

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (user) {
        try {
          // Set isFetching to true when you start fetching
          setIsFetching(true);

          const isUserFollowing = await checkIfFollowing(user.email);

          // Update isFollowing state based on the fetch result
          setIsFollowing(isUserFollowing);
        } catch (error) {
          console.error('Error while checking following status:', error);
        } finally {
          // Set isFetching back to false after fetching and updating the state
          setIsFetching(false);
        }
      }
    };

    const checkFollowerStatus = async () => {
      if (user) {
        try {
          // Set isFetching to true when you start fetching
          setIsFetching(true);
          const isUserFollower = await checkIfFollower(user.email);
          // Update isFollowing state based on the fetch result
          setIsFollower(isUserFollower);
        } catch (error) {
          console.error('Error while checking following status:', error);
        }
        finally {
          // Set isFetching back to false after fetching and updating the state
          setIsFetching(false);
        }
      }
    }
    checkFollowingStatus();
    checkFollowerStatus();
  }, [user]);
  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <View style={styles.profileContainerWhole}>
          {user && loggedInUser && user.email === loggedInUser.email && (
            <EditProfileButton onPress={handleEditButton} />
          )}
          {user && loggedInUser && user.email !== loggedInUser.email && (
          <FollowButton isFollowing={isFollowing} isFetching={isFetching} onPress={handleFollowButton} />
          )}
          <View style={styles.profileContainer}>
            <ProfilePicture imageUrl={user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'} onPress={toggleModal} />
            <ProfilePictureModal
              isVisible={isModalVisible}
              imageUrl={user.avatar || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}
              onClose={toggleModal}
            />

            <View style={styles.userInfoContainer}>
            {user && loggedInUser && user.email !== loggedInUser.email && isFollower && (
              <View style={styles.followsYouContainer}>
                <Text style={styles.followsYouText}>Follows you</Text>
              </View>
            )}


              {user.name && <Text style={styles.nameText}>{user.name} {user.last_name}</Text>}
              {user.username && <Text style={styles.usernameText}>@{user.username}</Text>}
            </View>
          </View>

          <View style={styles.BioAndStatsContainer}>
            <Text style={styles.bioText}>{user.bio || "Hey, I'm using SnapMessage! :)"}</Text>
            <ProfileStats
              followers={followers}
              following={following}
              snaps={user.snaps}
              onFollowingPress={handleFollowingButton}
              onFollowersPress={handleFollowersButton}
            />
            <ProfileExtraInfo
              dateOfBirth={user.date_of_birth}
              location={user.location}
            />
          </View>
        </View>
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginVertical: 15
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userInfoContainer: {
    marginLeft: 16,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  usernameText: {
    fontSize: 15,
    color: '#6B5A8E',
  },
  bioText: {
    fontSize: 15,
    marginBottom: 16,
    marginLeft: 18,
  },
  flatListContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  BioAndStatsContainer: {
    paddingHorizontal: 16,
  },
  profileContainerWhole: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  followsYouContainer: {
    flexDirection: 'row', // Use flexDirection 'row' to make the text wrap
    alignItems: 'center', // Align text vertically in the container
    marginBottom: 5,
  },
  followsYouText: {
    backgroundColor: 'rgba(107, 90, 142, 0.5)', // Background color and opacity
    borderRadius: 5, // Adjust the border radius as needed
    paddingHorizontal: 8,
    color: '#fff', // Text color inside the rectangle
    fontSize: 12,
  },
});