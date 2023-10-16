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


export default function ProfileUser({ user, posts}) {

    const { loggedInUser } = useUser(); // Use the hook to access loggedInUser
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [followers, setFollowers] = useState(null);
    const [following, setFollowing] = useState(null);
    const [isModalVisible, setModalVisible] = useState(false);
    const [isFollowing, setIsFollowing] = useState(null);
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
      if (isFollowing || (user && loggedInUser && user.email === loggedInUser.email)) {
        navigation.push('FollowersList', { user: user });
      }
    };
  
    const handleFollowingButton = () => {
      if (isFollowing || (user && loggedInUser && user.email === loggedInUser.email)) {
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
  
      checkFollowingStatus();
    }, [user]);
  
    const handlePress = () => {
      navigation.navigate('NewTweet');
    };
  
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
  
            <FlatList
              data={posts}
              renderItem={({ item }) => item && <Tweet tweet={item} />}
            />
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