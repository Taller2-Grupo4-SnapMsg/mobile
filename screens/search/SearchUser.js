import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
    ActivityIndicator,
} from 'react-native';
import searchUserByUsername from '../../handlers/searchUserByUsername';
import { useUser } from '../../UserContext';
import checkIfFollowing from '../../handlers/checkIfFollowing';
import followUser from '../../handlers/followUser';
import unfollowUser from '../../handlers/unfollowUser';
import { useNavigation } from '@react-navigation/native';

export default function SearchUser() {
  const [searchText, setSearchText] = useState(''); // State for the search text
  const [ammount, setAmmount] = useState(5); // State for the ammount of users to search
  const [offset, setOffset] = useState(0); // State for the offset of users to search
  const [users, setUsers] = useState([]); // State to store the list of users
  const [isFetchingMap, setIsFetchingMap] = useState({});
  const [followingStatus, setFollowingStatus] = useState({});
  const { loggedInUser } = useUser();
  const navigation = useNavigation();

  const handleSearchButton = async () => {
    // Handle the search button press
    try {
      const response = await searchUserByUsername(searchText, offset, ammount);
      if (response) {
        const initialFollowingStatus = {};
        const users_emails = response.map((user) => user.email);
  
        const followStatusPromises = users_emails.map(async (user_email) => {
          setIsFetchingMap((prevIsFetchingMap) => ({
            ...prevIsFetchingMap,
            [user_email]: true,
          }));
  
          const isUserFollowing = await checkIfFollowing(user_email);
  
          setIsFetchingMap((prevIsFetchingMap) => ({
            ...prevIsFetchingMap,
            [user_email]: false,
          }));
          
          initialFollowingStatus[user_email] = isUserFollowing;
          
          return { email: user_email, isFollowing: isUserFollowing };
        });
  
        const followingStatusArray = await Promise.all(followStatusPromises);
  
        setFollowingStatus(initialFollowingStatus);
        setUsers(response); // Set the users in state
      } else {
        setUsers([]); // Clear the user list
      }
    } catch (error) {
      console.error('Error in search:', error);
    }
  }
  
  const handleFollowButton = async (itemEmail) => {
    setIsFetchingMap((prevIsFetchingMap) => ({
      ...prevIsFetchingMap,
      [itemEmail]: true,
    }));

    if (followingStatus[itemEmail]) {
      await unfollowUser(itemEmail);
    } else {
      await followUser(itemEmail);
    }

    setFollowingStatus((prevStatus) => ({
      ...prevStatus,
      [itemEmail]: !prevStatus[itemEmail],
    }));

    setIsFetchingMap((prevIsFetchingMap) => ({
      ...prevIsFetchingMap,
      [itemEmail]: false,
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchText}
          onChangeText={(text) => setSearchText(text)}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchButton}
        >
          <Text>Search</Text>
        </TouchableOpacity>
      </View>
      <FlatList
          data={users}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              if (loggedInUser && item.email !== loggedInUser.email) {
                navigation.navigate('Profile', { user_param: item });
              }
            }}
          >
              <Image style={styles.image} source={{ uri: item.avatar || "https://static-00.iconduck.com/assets.00/profile-circle-icon-2048x2048-cqe5466q.png"}} />
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <View>
                  <Text style={styles.usernameText}>@{item.username}</Text>
                  <Text numberOfLines={1} style={styles.bioText}>
                    {item.bio}
                  </Text>
                </View>
              </View>

              {loggedInUser && item.email !== loggedInUser.email && (
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleFollowButton(item.email)}
                  disabled={isFetchingMap[item.email]}
                >
                  {isFetchingMap[item.email] ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.followButtonText}>
                      {followingStatus[item.email] ? 'Following' : 'Follow'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

            </TouchableOpacity>

          )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    borderColor: '#6B5A8E',
    paddingLeft: 15,
  },
  searchButton: {
    marginLeft: 10,
    backgroundColor: '#6B5A8E',
    padding: 10,
    borderRadius: 50,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#6B5A8E',
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
  bioText: {
    fontSize: 14,
    marginTop: 4,
  },
  followButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
    backgroundColor: '#6B5A8E',
  },
  followButtonText: {
    color: 'white',
  },
});
