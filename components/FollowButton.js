import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function FollowButton({ isFollowing, isFetching, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.followButton}>
      {isFetching ? (
        <ActivityIndicator size="small" color="#FFF" />
      ) : (
        <Text style={styles.followButtonText}>
          {isFollowing ? 'Following' : 'Follow'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  followButton: {
    position: 'absolute',
    top: 2,
    right: 10,
    backgroundColor: '#6B5A8E', // Change the background color as needed
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 20,
  },
  followButtonText: {
    fontWeight: 'bold',
  },
});
