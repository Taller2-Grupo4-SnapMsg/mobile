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

export default function Profile() {
  const route = useRoute();
  const { user_param } = route.params || {}; // Provide an empty object as a default
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const fetchUserData = async () => {
    try {
      // Fetch the logged-in user regardless of user_param
      const loggedInUser = await getUserByToken();
      if (loggedInUser) {
        setLoggedInUser(loggedInUser);
      } else {
        console.log('No se pudo obtener el usuario');
      }

      // Check if user parameters are provided and set the user state accordingly
      if (route.params && Object.keys(user_param).length !== 0) {
        setUser(user_param);
      } else {
        // Handle the case where user parameters are not provided
        setUser(loggedInUser);
      }

      setIsLoading(false); // Set loading to false after fetching
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      setIsLoading(false); // Set loading to false in case of an error
    }
  };

  // Use useEffect to fetch user data when the component mounts or user_param changes
  useEffect(() => {
    fetchUserData();
  }, [user_param]);

  // Use useFocusEffect to refetch user data when the screen gains focus
  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isLoading}
          textContent={'Cargando...'}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  }

  return <ProfileUser user={user} loggedInUser={loggedInUser} />;
}

function ProfileUser({ user, loggedInUser }) {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);

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

  useEffect(() => {
    if (user) {
      fetchFollowersCount();
      fetchFollowingCount();
    }
  }, [user]);

  const handleEditButton = () => {
    navigation.navigate('EditProfile', { user: user });
  };

  const handleFollowersButton = () => {
    if (isFollowing || (user && loggedInUser && user.email === loggedInUser.email)) {
      navigation.push('FollowersList', { user: user });
    }
  };

  const handleFollowingButton = () => {
    if (isFollowing || (user && loggedInUser && user.email === loggedInUser.email)) {
      navigation.navigate('FollowingsList', { user: user });
    }
  };

  const handleFollowButton = async () => {
    if (isFollowing) {
      await unfollowUser(user.email);
    } else {
      await followUser(user.email);
    }

    setIsFollowing(!isFollowing);
    fetchFollowersCount();
    fetchFollowingCount();
  };

  useEffect(() => {
    const checkFollowingStatus = async () => {
      if (user) {
        const isUserFollowing = await checkIfFollowing(user.email);
        setIsFollowing(isUserFollowing);
      }
    };

    checkFollowingStatus();
  }, [user]);
  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <View style={styles.profileContainerWhole}>
          {user && loggedInUser && user.email === loggedInUser.email && (
            <EditProfileButton onPress={handleEditButton} />
          )}
          {user && loggedInUser && user.email !== loggedInUser.email && (
            <FollowButton isFollowing={isFollowing} onPress={handleFollowButton} />
          )}
          <View style={styles.profileContainer}>
            <ProfilePicture imageUrl={user.avatar} onPress={toggleModal} />
            <ProfilePictureModal
              isVisible={isModalVisible}
              imageUrl={user.avatar}
              onClose={toggleModal}
            />
            <View style={styles.userInfoContainer}>
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
});
