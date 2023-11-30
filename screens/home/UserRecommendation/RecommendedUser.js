import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';


export default function RecommendedUser(
    {item,
    loggedInUser,
    navigation,
    isFetchingMap,
    followingStatus,
    handleFollowButton}
) {
  var {
    interactions_that_match_my_interests,
    location_in_common,
    mutual_friends,
    posts_that_match_my_interests,
    user} = item;
    
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        if (loggedInUser && user.email !== loggedInUser.email) {
          navigation.push('Profile', { user_param: user });
        }
      }}
    >
      <Image style={styles.image} source={{ uri: user.avatar }} />
      <View style={styles.textContainer}>
        <Text style={styles.nameText}>{user.name}</Text>
        <View>
          <Text style={styles.usernameText}>@{user.username}</Text>
          <Text numberOfLines={2} style={styles.bioText}>
            {user.bio}
          </Text>
        </View>
      </View>

      {loggedInUser && user.email !== loggedInUser.email && (
        <TouchableOpacity
          style={styles.followButton}
          onPress={() => handleFollowButton(user.email)}
          disabled={isFetchingMap[user.email]}
        >
          {isFetchingMap[user.email] ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text style={styles.followButtonText}>
              {followingStatus[user.email] ? 'Following' : 'Follow'}
            </Text>
          )}
        </TouchableOpacity>
      )}
    </TouchableOpacity>
    );}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: 20,
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
        paddingVertical: 6,
        paddingHorizontal: 16,
        borderRadius: 50,
        backgroundColor: '#6B5A8E',
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