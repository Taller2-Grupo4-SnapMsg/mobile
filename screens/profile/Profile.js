import React, { useEffect, useState } from 'react';
import tweets from '../../assets/data/tweets';
import Tweet from '../../components/Tweet';
import { Feather } from '@expo/vector-icons';
import getUserByEmail from '../../handlers/getUserByEmail';
import { useColorScheme } from 'react-native';
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity
} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';

const userEmailHarcodeado = '';

export default function Profile({ /*user*/ }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUserByEmail('marta04@fi.uba.ar')
      .then((userData) => {
        setUser(userData);
      })
      .catch((error) => {
        console.error('Error al obtener usuario:', error);
      });
  }, []);

  if (!user) {
    return <Text>User not found!</Text>;
  }
  return (
    <ProfileUser user={user} />
  );
}

function ProfileUser({ user }) {
  const colorScheme = useColorScheme();

  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <View style={styles.container}>
      <TouchableOpacity style={styles.editButton}>
        <Feather name="edit" size={24} />
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        {user.image && (
          <Image style={styles.avatar} source={{ uri: user.image }} />
        )}

        <View style={styles.userInfoContainer}>
          {user.name && <Text style={styles.nameText}>{user.name}</Text>}
          {user.username && <Text style={styles.usernameText}>@{user.username}</Text>}
        </View>
      </View>
      <View style={styles.BioAndStatsContainer}>
        {user.bio && <Text style={styles.bioText}>{user.bio}</Text>}

        <View style={styles.statsContainer}>
          {user.following !== undefined && (
            <Text style={styles.statsCountText}>
              {user.following}{'  '}
              <Text style={styles.statsLabelText}>Following</Text>
            </Text>
          )}
          {user.followers !== undefined && (
            <Text style={styles.statsCountText}>
              {user.followers}{'  '}
              <Text style={styles.statsLabelText}>Followers</Text>
            </Text>
          )}
        </View>
      </View>
      <View style={styles.flatListContainer}>
        <FlatList
          data={tweets}
          renderItem={({ item }) =>
            item && item.user.id === user.id && <Tweet tweet={item} />
          }
        />
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
    //color: 'white',
  },
  usernameText: {
    fontSize: 15,
    //color: 'gray',
  },
  bioText: {
    fontSize: 15,
    //color: 'white',
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
    //color: 'gray',
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