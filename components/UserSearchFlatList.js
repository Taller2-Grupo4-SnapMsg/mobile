import React from "react";
import { StyleSheet, FlatList, TouchableOpacity, Image, Text, View, ActivityIndicator } from "react-native";

export default function UserSearchFlatList(
    {users,
    loggedInUser,
    navigation,
    isFetchingMap,
    followingStatus,
    handleFollowButton,
    showMoreVisible,
    handleShowMoreButton,
    }
) {
    return (
        <FlatList
          data={users}
          keyExtractor={(item) => item.email}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemContainer}
              onPress={() => {
                if (loggedInUser && item.email !== loggedInUser.email) {
                  navigation.navigate('Profile', { user_param: item });
                }
              }}
            >
              <Image
                style={styles.image}
                source={{ uri: item.avatar }}
              />
              <View style={styles.textContainer}>
                <Text style={styles.nameText}>{item.name}</Text>
                <View>
                  <Text style={styles.usernameText}>@{item.username}</Text>
                  <Text numberOfLines={1} style={styles.bioText}>
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
                      {followingStatus[item.email] ? 'Following' : 'Follow'}
                    </Text>
                  )}
                </TouchableOpacity>
          )}
            </TouchableOpacity>
          )}
          ListFooterComponent={() => (
            showMoreVisible && (
              <TouchableOpacity
                style={styles.showMoreButton}
                onPress={handleShowMoreButton}
              >
                <Text>Show More</Text>
              </TouchableOpacity>
            )
          )}
        />
    )
}

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
      bioText: {
        fontSize: 14,
        marginTop: 4,
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
      showMoreButton: {
        alignSelf: 'center', 
        paddingHorizontal: 14,
        paddingVertical: 5,
        backgroundColor: '#6B5A8E',
        borderRadius: 50,
        width: 100,
        marginTop: 20,
        marginBottom: 40,
      },
    
});    