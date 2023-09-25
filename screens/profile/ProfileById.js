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
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

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

  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <View style={styles.profileContainerWhole}>
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
        <Text style={styles.statsCountText}>{user.snaps}{'  '}
        <Text style={styles.statsLabelText}>Snaps</Text> </Text>
      </View>
      </View>
    </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={tweets}
          renderItem={({ item }) => item && item.user.id == user.id && <Tweet tweet={item} />}
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
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,    },
  statsCountText: {
    fontWeight: 'bold',
    marginRight: 10,
    color: '#6B5A8E',
  },
  statsLabelText: {
    fontWeight: 'bold',
    color: 'gray',
  },
  flatListContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  BioAndStatsContainer: {
    paddingHorizontal: 16,
  },
  editButton: {
    position: 'absolute',
    top: 10,
    right: 25,
  },
  profileContainerWhole: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
});
