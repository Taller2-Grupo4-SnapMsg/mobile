import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import getFollowings from '../../handlers/profile/getFollowings';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import checkIfFollowing from '../../handlers/profile/checkIfFollowing';
import followUser from '../../handlers/followUser';
import unfollowUser from '../../handlers/unfollowUser';
import { ActivityIndicator } from 'react-native'; 
import { useUser } from '../../contexts/UserContext';

export default function FollowingsById() {
  const route = useRoute();
  const { user } = route.params;

  if (!user) {
    return <Text>User {user} not found!</Text>;
  }

  return <Followings user={user} />;
}

const Followings = ({ user }) => {
  const navigation = useNavigation();

  const [followings, setFollowings] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [isFetchingMap, setIsFetchingMap] = useState({}); // Add isFetchingMap state
  const { loggedInUser } = useUser();

  const fetchFollowingsData = async () => {
    try {
      setIsFetchingMap({}); // Clear previous isFetchingMap when starting a new fetch
      const fetchedFollowings = await getFollowings(user.email);
      setFollowings(fetchedFollowings);
      const initialFollowerStatus = {};
      const followingEmails = fetchedFollowings.map((follower) => follower.email);

      // Fetch follow status for all followers in parallel
      const followStatusPromises = followingEmails.map(async (followingEmail) => {
        // Set isFetching for each user to true when you start fetching
        setIsFetchingMap((prevIsFetchingMap) => ({
          ...prevIsFetchingMap,
          [followingEmail]: true,
        }));

        const isUserFollowing = await checkIfFollowing(followingEmail);

        // Set isFetching back to false after fetching for each user
        setIsFetchingMap((prevIsFetchingMap) => ({
          ...prevIsFetchingMap,
          [followingEmail]: false,
        }));

        return { email: followingEmail, isFollowing: isUserFollowing };
      });

      // Wait for all promises to resolve
      const followerStatusArray = await Promise.all(followStatusPromises);

      // Convert the array back to an object
      followerStatusArray.forEach((status) => {
        initialFollowerStatus[status.email] = status.isFollowing;
      });

      setFollowingStatus(initialFollowerStatus);
    } catch (error) {
      console.error('Error al obtener los followings:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Call fetchFollowingsData each time the screen mounts
      fetchFollowingsData();
    }, [user])
  );

  const handleFollowButton = async (itemEmail) => {
    setIsFetchingMap((prevIsFetchingMap) => ({
      ...prevIsFetchingMap,
      [itemEmail]: true, // Set isFetching to true when you start the action
    }));

    // Check the current status from the local state
    if (followingStatus[itemEmail]) {
      await unfollowUser(itemEmail);
    } else {
      await followUser(itemEmail);
    }

    // Update the local state
    setFollowingStatus((prevStatus) => ({
      ...prevStatus,
      [itemEmail]: !prevStatus[itemEmail],
    }));

    setIsFetchingMap((prevIsFetchingMap) => ({
      ...prevIsFetchingMap,
      [itemEmail]: false, // Set isFetching back to false after completing the action
    }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={followings}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              if (loggedInUser && item.email === loggedInUser.email) {
                navigation.navigate('InProfile');
              } else {
                navigation.push('InProfile', { user_param: item }); // Use push instead of navigate
              }
            }}
          >
            <Image style={styles.image} source={{ uri: item.avatar }} />
            <View style={styles.textContainer}>
              <Text style={styles.nameText}>{item.name}</Text>
              <View>
                <Text style={styles.usernameText}>@{item.username}</Text>
                <Text numberOfLines={2} style={styles.bioText}>
                  {item.bio}
                </Text>
              </View>
            </View>
            
            {loggedInUser && item.email !== loggedInUser.email && (
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleFollowButton(item.email)}
                  disabled={isFetchingMap[item.email]} // Disable the button while fetching for this user
                >
                  {isFetchingMap[item.email] ? (
                    <ActivityIndicator size="small" color="white" /> // Show a spinner while fetching for this user
                  ) : (
                    <Text style={styles.followButtonText}>
                      {followingStatus[item.email] ? 'Following' : 'Follow'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
        keyExtractor={(item) => item.email}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start', 
    justifyContent: 'space-between', 
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 14,
    color: '#6B5A8E',
  },
  followButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
    backgroundColor: "#6B5A8E",
  },
  followButtonText: {
    color: 'white',
  },
  bioText: {
    fontSize: 14,
    color: '#555', 
    marginTop: 4, 
  },
});
