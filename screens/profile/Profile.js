import React, { useEffect, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';
import getUserByToken from '../../handlers/getUserByToken'
import getFollowersByUsername from '../../handlers/getFollowersByUsername';
import getFollowingByUsername from '../../handlers/getFollowingByUsername';
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons'; 

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

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const fetchedUser = await getUserByToken();
      if (fetchedUser) {
        setUser(fetchedUser);
      } else {
        console.log('No se pudo obtener el usuario');
      }
    } catch (error) {
      console.error('Error al obtener usuario:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Llama a fetchUserData cada vez que la pantalla se monte
      fetchUserData();
    }, [])
  );

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  if (!user) {
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

  // Renderiza el contenido de ProfileUser solo cuando se obtiene el usuario
  return <ProfileUser user={user} />;
}

function formatDateOfBirth(dateOfBirth) {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const date = new Date(dateOfBirth);
  const month = date.getMonth();
  const day = date.getDate();
  const year = date.getFullYear();

  const formattedDate = `${months[month]} ${day}, ${year}`;
  return formattedDate;
}

function ProfileUser({ user }) {
 
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

  useEffect(() => {
    const fetchFollowersData = async () => {
      try {
        const fetchedFollowers = await getFollowersByUsername(user.email);
        if (fetchedFollowers) { //aca ver porque 0 es un numero valido, no deberia entar al else
          setFollowers(fetchedFollowers);
        } else {
          console.log('No se pudo obtener los followers');
        }
      } catch (error) {
        console.error('Error al obtener los followers:', error);
      }
    };

    fetchFollowersData();
  });

  useEffect(() => {
    const fetchFollowingData = async () => {
      try {
        const fetchedFollowing = await getFollowingByUsername(user.email);
        if (fetchedFollowing) {
          setFollowing(fetchedFollowing);
        } else {
          console.log('No se pudo obtener los followings');
        }
      } catch (error) {
        console.error('Error al obtener los followings:', error);
      }
    };

    fetchFollowingData();
  }, []);

  const handleEditButton = () => {
    navigation.navigate('EditProfileById' , {user: user});
  }


  const handleFollowersButton = () => {
     navigation.navigate('FollowersById' , {user: user});
  }

  const handleFollowingButton = () => {
    navigation.navigate('FollowingsById' , {user: user});
  }

  

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <View style={styles.profileContainerWhole}>
            <TouchableOpacity style={styles.editButton} onPress={handleEditButton}>
            <Feather name="edit" size={24} color={'#6B5A8E'} />
          </TouchableOpacity>
          <View style={styles.profileContainer}>
              <Image style={styles.avatar} source={{ uri: user.avatar || 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-3.jpg'}} />
            <View style={styles.userInfoContainer}>
              {user.name && <Text style={styles.nameText}>{user.name} {user.last_name}</Text>}
              {user.username && <Text style={styles.usernameText}>@{user.username}</Text>}
            </View>
          </View>
          <View style={styles.BioAndStatsContainer}>
            <Text style={styles.bioText}>{user.bio || "Hey, I'm using SnapMessage! :)"}</Text>

            <View style={styles.statsContainer}>
              <TouchableOpacity onPress={handleFollowingButton}>
                <Text style={styles.statsCountText}>{following || 0}{'  '}
                <Text style={styles.statsLabelText}>Following</Text> </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleFollowersButton}>
                <Text style={styles.statsCountText}>{followers || 0}{'  '}
                <Text style={styles.statsLabelText}>Followers</Text> </Text>
              </TouchableOpacity>
              <Text style={styles.statsCountText}>{user.snaps || 0}{'  '}
              <Text style={styles.statsLabelText}>Snaps</Text></Text>
            </View>


          <View style={styles.birthdayContainer}>
          <View style={styles.calendarIcon}>
          <FontAwesome name="birthday-cake" size={16} color="#6B5A8E" />
          </View>
            <View style={styles.dateOfBirthContainer}>
            <Text style={styles.statsCountText}>
              {formatDateOfBirth(user.date_of_birth)}
            </Text>
            </View>
          </View>
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
    marginLeft: 18,
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
  },
  birthdayContainer: {
    flexDirection: 'row',
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: 10, 
    marginBottom:10,
    fontSize: 16,
  },
  calendarIcon: {
    marginRight: 10, 
  },
  dateOfBirthContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
});

