import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Avatar } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUser } from '../../contexts/UserContext';
import DeleteDeviceToken from '../../handlers/notifications/deleteTokenDevice';

function CustomDrawerContent({ navigation }) {
  const {loggedInUser} = useUser(); 

  const handleSignOut = async () => {
    await DeleteDeviceToken();
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
            navigation.navigate('InHome');
          }}
        >
          <View style={styles.itemContainer}>
            <Icon name="home" size={25} color="#6B5A8E" style={styles.icon}/>
            <Text style={styles.drawerItemText}>Home</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('ProfileDetail');
          }}
        >
          <View style={styles.itemContainer}>
            <Icon name="user" size={25} color="#6B5A8E" style={styles.icon}/>
            <Text style={styles.drawerItemText}>Profile</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('SearchUserScreen');
          }}
        >
          <View style={styles.itemContainer}>
            <Icon name="search" size={25} color="#6B5A8E" style={styles.icon}/>
            <Text style={styles.drawerItemText}>Search</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('StatisticsScreen');
          }}
        >
          <View style={styles.itemContainer}>
            <Icon name="bar-chart" size={22} color="#6B5A8E" style={styles.icon}/>
            <Text style={styles.drawerItemText}>Statistics</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('ChatsScreen');
          }}
        >
          <View style={styles.itemContainer}>
            <Icon name="comments" size={25} color="#6B5A8E" style={styles.icon}/>
            <Text style={styles.drawerItemText}>Chats</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('NotificationsScreen');
          }}
        >
          <View style={styles.itemContainer}>
            <Icon name="bell" size={25} color="#6B5A8E" style={styles.icon}/>
            <Text style={styles.drawerItemText}>Notifications</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.drawerItem}
          onPress={() => {
            navigation.navigate('TrendingTopicScreen');
          }}
        >
          <View style={styles.itemContainer}>
            <Icon name="hashtag" size={25} color="#6B5A8E" style={styles.icon}/>
            <Text style={styles.drawerItemText}>Trending Topics</Text>
          </View>
        </TouchableOpacity>

      </View>
        <View style={styles.avatarSignoutContainer}>
          <View style={styles.cont}>
            <Avatar
              rounded
              source={{ uri: loggedInUser.avatar }}
              size="large"
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              {loggedInUser && <Text style={styles.userName}> {loggedInUser.name} </Text>}
              {loggedInUser && <Text style={styles.userHandle}> @{loggedInUser.username} </Text>}
            </View>
          </View>
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
        >
          <View style={styles.icon}>
            <Icon name="sign-out" size={30} color="#6B5A8E" />
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
  icon:{
    margin: 10,
    marginLeft: 5,
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