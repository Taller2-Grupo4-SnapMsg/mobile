import React from 'react';
import { View, Text } from 'react-native';
import { ThemeProvider, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import ProfilePicture from './ProfilePicture';
import ProfilePictureModal from './ProfilePictureModal';
import ProfileStats from './ProfileStats';
import ProfileExtraInfo from './ProfileExtraInfo';
import EditProfileButton from './EditProfileButton';
import FollowButton from './FollowButton';
import { AntDesign } from '@expo/vector-icons';
import RoundedCheckboxButton from './RoundedCheckBox';
import { useState } from 'react';
import { set } from 'firebase/database';


export default function ProfileBanner({ 
  user,
  loggedInUser,
  isFollowing,
  isFetching,
  followers,
  following,
  snaps,
  isFollower,
  toggleModal,
  isModalVisible,
  handleEditButton,
  handleFollowButton,
  handleFollowingButton,
  handleFollowersButton,
  colorScheme, 
  onlyReposts,
  setOnlyReposts,
  setOnlyFavs,
  setAllPosts,
  onlyFavs,
  allPosts,
  loadingMore, 
 }) {

  const handleSetOnlyReposts = () => {
    if (loadingMore) return;
    if (!onlyFavs && !allPosts) return;
    setOnlyReposts(!onlyReposts);
    setOnlyFavs(false);
    setAllPosts(false);
  }

  const handleSetOnlyFavs= () => {
    if (loadingMore) return;
    if (!onlyReposts && !allPosts) return;
    setOnlyFavs(!onlyFavs);
    setAllPosts(false);
    setOnlyReposts(false);
  }

  const handleSetAllPosts = () => {
    if (loadingMore) return;
    if (!onlyReposts && !onlyFavs) return; 
    setAllPosts(!allPosts);
    setOnlyReposts(false);
    setOnlyFavs(false);
  }
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={styles.container}>
          <View style={styles.profileContainerWhole}>
            {user && loggedInUser && user.email === loggedInUser.email && (
              <View style={styles.buttonContainer}>
                <EditProfileButton onPress={handleEditButton} />
              </View>
            )}
            {user && loggedInUser && user.email !== loggedInUser.email && (
            <FollowButton isFollowing={isFollowing} isFetching={isFetching} onPress={handleFollowButton} />
            )}
            <View style={styles.profileContainer}>
              <ProfilePicture imageUrl={user.avatar} onPress={toggleModal} />
              <ProfilePictureModal
                isVisible={isModalVisible}
                imageUrl={user.avatar}
                onClose={toggleModal}
              />

              <View style={styles.userInfoContainer}>
              {user && loggedInUser && user.email !== loggedInUser.email && isFollower && (
                <View style={styles.followsYouContainer}>
                  <Text style={styles.followsYouText}>Follows you</Text>
                </View>
              )}
              {user.name && user.last_name && ((user.name.length > 7 && user.last_name.length >5)) ? (
                <View>
                  {console.log(user.name.length)}
                  <Text style={styles.nameText}>{user.name}</Text>
                  <Text style={styles.lastNameText}>{user.last_name}</Text>
                </View>
              ) : (
                <Text style={styles.nameText}>{user.name} {user.last_name}</Text>
              )}


                {user.username && <Text style={styles.usernameText}>@{user.username}</Text>}
              </View>
            </View>

            <View style={styles.BioAndStatsContainer}>
              <Text style={styles.bioText}>{user.bio || "Hey, I'm using SnapMessage! :)"}</Text>
              <ProfileStats
                followers={followers}
                following={following}
                snaps={snaps}
                onFollowingPress={handleFollowingButton}
                onFollowersPress={handleFollowersButton}
              />
              { ((user && user.is_public) || (user.email !== loggedInUser.email && isFollower) || (user.email === loggedInUser.email)) && (
              <ProfileExtraInfo
                dateOfBirth={user.date_of_birth}
                location={user.location}
              />)}
            </View>
          </View>
        </View>
        {user && loggedInUser && user.email === loggedInUser.email &&
        <View style={styles.checkBoxesContainer}>
          <RoundedCheckboxButton text="Posts" isChecked={allPosts} onToggle={handleSetAllPosts} />
          <RoundedCheckboxButton text="Snapshares" isChecked={onlyReposts} onToggle={handleSetOnlyReposts} />
          <RoundedCheckboxButton text="Favorites" isChecked={onlyFavs} onToggle={handleSetOnlyFavs} />
      </View> }
      </ThemeProvider>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'column',
    //height: 'auto', 
  },
  profileContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal: 16,
    //backgroundColor: 'blue',
  },
  userInfoContainer: {
    marginLeft: 16,
  },
  nameText: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  lastNameText :{
    fontWeight: 'bold',
    fontSize: 22,
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
  flatListContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  repostContainer: {
    flexDirection: 'row',
    marginRight: 70,
    marginTop: 5,
  },
  iconContainer: {
    flex: 1,
    marginTop: 2,
    width: 30,
    height: 30,
    backgroundColor: '#B8ADCC',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 33,
    top: 60,
  },
  iconContainerPress: {
    flex: 1,
    marginTop: 2,
    width: 30,
    height: 30,
    backgroundColor: '#6B5A8E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 33,
    top: 60,
  },
  buttonContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  BioAndStatsContainer: {
    flex: 1.1,
    paddingHorizontal: 16,
    //backgroundColor: 'green',
  },
  profileContainerWhole: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  followsYouContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 5,
  },
  followsYouText: {
    backgroundColor: 'rgba(107, 90, 142, 0.5)', 
    borderRadius: 5, 
    paddingHorizontal: 8,
    color: '#fff',
    fontSize: 12,
  },
  checkBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});