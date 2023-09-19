import React, { useRef } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';
import users from '../../assets/data/users';
import { useRoute } from '@react-navigation/native';
import tweets from '../../assets/data/tweets';
import Tweet from '../../components/Tweet';
import { Feather } from '@expo/vector-icons'; // Import Feather icons

export default function ProfileById() {
  const route = useRoute();
  const { userId } = route.params;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return <Text>User {user} not found!</Text>;
  }

  return (
      <Profile user={user}/>
  );
}


function Profile({ user }) {
  return (
    <View style={styles.container}>
            {/* Edit button */}
      <TouchableOpacity style={styles.editButton}>
        <Feather name="edit" size={24} />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image style={styles.avatar} source={{ uri: user.image }} />

        <View style={styles.userInfoContainer}>
          <Text style={styles.nameText}>{user.name}</Text>
          <Text style={styles.usernameText}>@{user.username}</Text>
        </View>
    </View>
    <View style={styles.BioAndStatsContainer} >
      <Text style={styles.bioText}>{user.bio}</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsCountText}>{user.following}{'  '}
        <Text style={styles.statsLabelText}>Following </Text> </Text>
        <Text style={styles.statsCountText}>{user.followers}{'  '}
        <Text style={styles.statsLabelText}>Followers</Text> </Text>
      </View>
    </View>
      {/* Separate container for FlatList */}
      <View style={styles.flatListContainer}>
        <FlatList
          data={tweets}
          renderItem={({ item }) => item && <Tweet tweet={item} />}
        />
      </View>
    </View>
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
  avatar: {
    width: 75,
    height: 75,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: 'black',
  },
  userInfoContainer: {
    marginLeft: 16,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'white',
  },
  usernameText: {
    fontSize: 15,
    color: 'gray',
  },
  bioText: {
    fontSize: 15,
    color: 'white',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Add this line
    marginBottom: 20,    },
  statsCountText: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  statsLabelText: {
    fontWeight: 'bold',
    color: 'gray',
  },
  // Separate container styles for FlatList
  flatListContainer: {
    flex: 1, // Take up remaining vertical space
    paddingHorizontal: 0, // Remove horizontal padding
  },
  BioAndStatsContainer: {
    paddingHorizontal: 16,
  },
  editButton: {
    position: 'absolute',
    top: 10, // Adjust the top position as needed
    right: 25, // Adjust the right position as needed
  },
});
