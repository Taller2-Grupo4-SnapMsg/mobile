import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome'; // Reemplaza con el ícono que desees utilizar
import { useUser } from '../contexts/UserContext';
import { useRoute } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import getUserByToken from '../handlers/getUserByToken';

function CustomDrawerContent({ navigation }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserByToken();
        console.log(user);
        if (user) {
          setUser(user);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };

    fetchUser();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isLoading}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  }

  const handleSignOut = async () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuItemsContainer}>
        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('Profile');
          }}
        >
          <View style={styles.itemContainer}>
            <Icon name="user" size={20} color="black" />
            <Text style={styles.drawerItemText}>Profile</Text>
          </View>
        </TouchableOpacity>
      </View>
        <View style={styles.avatarSignoutContainer}>
          <View style={styles.cont}>
            <Avatar
              rounded
              source={{ uri: user.avatar }}
              size="large"
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              {user && <Text style={styles.userName}> {user.name} </Text>}
              {user && <Text style={styles.userHandle}> @{user.username} </Text>}
            </View>
          </View>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <View style={styles.icon}>
            <Icon name="sign-out" size={40} color="black" />
            <Text style={[styles.drawerItemText, styles.signOutText]}></Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
  },
  menuItemsContainer: {
    flex: 1,
    paddingTop: 20,
  },
  avatarSignoutContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    borderTop: '#ecf0f1',
    borderTopWidth: 0.4,
    backgroundColor: '#ecf0f1',
  },
  cont: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
  },
  userHandle: {
    fontSize: 16,
    opacity: 0.8,
  },
  drawerItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  drawerItemText: {
    fontSize: 18,
    marginLeft: 10,
  },
  signOutButton: {
    backgroundColor: 'transparent',
  },
  signOutText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
    border: 'white',
  },
  icon: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
});

export default CustomDrawerContent;

