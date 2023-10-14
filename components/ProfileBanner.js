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


export default function ProfileBanner({ 
  user,
  loggedInUser,
  isFollowing,
  isFetching,
  followers,
  following,
  isFollower,
  toggleModal,
  isModalVisible,
  handleEditButton,
  handleFollowButton,
  handleFollowingButton,
  handleFollowersButton,
  colorScheme, 
 }) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <View style={styles.container}>
          <View style={styles.profileContainerWhole}>
            {user && loggedInUser && user.email === loggedInUser.email && (
              <EditProfileButton onPress={handleEditButton} />
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

                {user.name && <Text style={styles.nameText}>{user.name} {user.last_name}</Text>}
                {user.username && <Text style={styles.usernameText}>@{user.username}</Text>}
              </View>
            </View>

            <View style={styles.BioAndStatsContainer}>
              <Text style={styles.bioText}>{user.bio || "Hey, I'm using SnapMessage! :)"}</Text>
              <ProfileStats
                followers={followers}
                following={following}
                snaps={user.snaps}
                onFollowingPress={handleFollowingButton}
                onFollowersPress={handleFollowersButton}
              />
              <ProfileExtraInfo
                dateOfBirth={user.date_of_birth}
                location={user.location}
              />
            </View>
          </View>
        </View>
      </ThemeProvider>
    )
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
  flatListContainer: {
    flex: 1,
    paddingHorizontal: 0,
  },
  BioAndStatsContainer: {
    paddingHorizontal: 16,
  },
  profileContainerWhole: {
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
});