import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRoute } from '@react-navigation/native';
import getFollowers from '../../handlers/getFollowers';
import { useNavigation } from '@react-navigation/native';

export default function FollowersById() {
  const route = useRoute();
  const { user } = route.params;

  if (!user) {
    return <Text>User {user} not found!</Text>;
  }

  return <Followers user={user} />;
}

const Followers = ({ user }) => {
  const navigation = useNavigation();

  const [followers, setFollowers] = useState([]);
  const [followerStatus, setFollowersStatus] = useState({});

  useEffect(() => {
    const fetchFollowersData = async () => {
      try {
        const fetchedFollowers = await getFollowers(user.email);
        if (fetchedFollowers) {
          setFollowers(fetchedFollowers);
          const initialFollowerStatus = {};
          fetchedFollowers.forEach((item) => {
            initialFollowerStatus[item.email] = true; 
          });
          setFollowersStatus(initialFollowerStatus);
        } else {
          console.log('No se pudo obtener los followings');
        }
      } catch (error) {
        console.error('Error al obtener los followings:', error);
      }
    };

    fetchFollowersData();
  }, [user.email]); 

  const toggleFollower = (email) => {
    setFollowersStatus((prevStatus) => ({
      ...prevStatus,
      [email]: !prevStatus[email], 
    }));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={followers}
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
              onPress={() => toggleFollower(item.email)}
            >
              <Text style={styles.followButtonText}>
                {followerStatus[item.email] ? 'Following' : 'Follow'}
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
