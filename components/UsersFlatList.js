import { list } from 'firebase/storage';
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';


export default function UsersFlatList(
    {list,
    loggedInUser,
    navigation,
    isFetchingMap,
    followStatus,
    handleFollowButton}
) {
    return (
        <FlatList
          data={list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                if (loggedInUser && item.email !== loggedInUser.email) {
                  navigation.push('Profile', { user_param: item });
                }
              }}
            >
              <Image style={styles.image} source={{ uri: item.avatar }} />
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <View>
                  <Text style={styles.usernameText}>@{item.username}</Text>
                  <Text numberOfLines={2} style={styles.bioText}>
                    {item.bio}
                  </Text>
                </View>
              </View>

              {loggedInUser && item.email !== loggedInUser.email && (
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={() => handleFollowButton(item.email)}
                  disabled={isFetchingMap[item.email]}
                >
                  {isFetchingMap[item.email] ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.followButtonText}>
                      {followStatus[item.email] ? 'Following' : 'Follow'}
                    </Text>
                  )}
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.email}
        />
)}

const styles = StyleSheet.create({
    itemContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: StyleSheet.hairlineWidth,
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
        paddingVertical: 4,
        paddingHorizontal: 12,
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