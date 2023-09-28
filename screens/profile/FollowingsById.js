import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import getFollowings from '../../handlers/getFollowings';
import { useNavigation } from '@react-navigation/native';


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

  useEffect(() => {
    const fetchFollowingsData = async () => {
      try {
        const fetchedFollowings = await getFollowings(user.email);
        if (fetchedFollowings) {
          setFollowings(fetchedFollowings);
          const initialFollowingStatus = {};
          fetchedFollowings.forEach((item) => {
            initialFollowingStatus[item.email] = true; 
          });
          setFollowingStatus(initialFollowingStatus);
        } else {
          console.log('No se pudo obtener los followings');
        }
      } catch (error) {
        console.error('Error al obtener los followings:', error);
      }
    };

    fetchFollowingsData();
  }, [user.email]); 

  const toggleFollowing = (email) => {
    setFollowingStatus((prevStatus) => ({
      ...prevStatus,
      [email]: !prevStatus[email], 
    }))
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={followings}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.itemContainer}
            onPress={() => {
              navigation.navigate('ProfileById', { user: item });
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

            <TouchableOpacity
              style={styles.followButton}
              onPress={() => toggleFollowing(item.email)}
            >
              <Text style={styles.followButtonText}>
                {followingStatus[item.email] ? 'Following' : 'Follow'}
              </Text>
            </TouchableOpacity>
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
