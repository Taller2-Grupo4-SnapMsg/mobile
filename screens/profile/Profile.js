import React, { useEffect, useState } from 'react';
import tweets from '../../assets/data/tweets';
import Tweet from '../../components/Tweet';
import { Feather } from '@expo/vector-icons';
import getUserByEmail from '../../handlers/getUserByEmail';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import getUserByToken from '../../handlers/getUserByToken'
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


  //const [token, setToken] = useState();

  /*useEffect(() => {
    console.log("se llama useEffect para obtener el token")
    const getToken = async () => {
      try {
        token = await AsyncStorage.getItem('token');
        setToken(token);
      } catch (error) {
        console.error('Error al recuperar el token:', error);
      }
    };

    getToken();
  }, []);*/

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const fetchedUser = await getUserByToken();
        if (fetchedUser) {
          console.log('Usuario:', fetchedUser);
          setUser(fetchedUser);
        } else {
          console.log('No se pudo obtener el usuario');
        }
      } catch (error) {
        console.error('Error al obtener usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando usuario...</Text>
      </View>
    );
  }

  // Renderiza el contenido de ProfileUser solo cuando se obtiene el usuario
  return <ProfileUser user={user} />;
}


function ProfileUser({ user }) {
  const colorScheme = useColorScheme();
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        <View style={styles.profileContainerWhole}>
          <TouchableOpacity style={styles.editButton}>
            <Feather name="edit" size={24} color={'#6B5A8E'} />
          </TouchableOpacity>
          <View style={styles.profileContainer}>
            {(
              <Image style={styles.avatar} source={{ uri: user.image || 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-3.jpg'}} />
            )}

            <View style={styles.userInfoContainer}>
              {user.name && <Text style={styles.nameText}>{user.name}</Text>}
              {user.username && <Text style={styles.usernameText}>@{user.username}</Text>}
            </View>
          </View>
          <View style={styles.BioAndStatsContainer}>
            <Text style={styles.bioText}>{user.bio || "Hey, I'm using SnapMessage! :)"}</Text>

            <View style={styles.statsContainer}>
            <Text style={styles.statsCountText}>{user.following || 0}{'  '}
            <Text style={styles.statsLabelText}>Following </Text> </Text>
            <Text style={styles.statsCountText}>{user.followers || 0}{'  '}
            <Text style={styles.statsLabelText}>Followers</Text> </Text>
            <Text style={styles.statsCountText}>{user.snaps || 0}{'  '}
            <Text style={styles.statsLabelText}>Snaps</Text> </Text>
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
    //color: 'white',
  },
  usernameText: {
    fontSize: 15,
    color: '#6B5A8E',
  },
  bioText: {
    fontSize: 15,
    //color: 'white',
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
