import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ProfileStats({ followers, following, snaps, onFollowingPress, onFollowersPress }) {
  return (
    <View style={styles.statsContainer}>
      <TouchableOpacity onPress={onFollowingPress}>
        <Text style={styles.statsCountText}>
          {following || 0}{'  '}
          <Text style={styles.statsLabelText}>Following</Text>
        </Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onFollowersPress}>
        <Text style={styles.statsCountText}>
          {followers || 0}{'  '}
          <Text style={styles.statsLabelText}>Followers</Text>
        </Text>
      </TouchableOpacity>
      <Text style={styles.statsCountText}>
        {snaps || 0}{'  '}
        <Text style={styles.statsLabelText}>Snaps</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,    
    },
    statsCountText: {
        fontWeight: 'bold',
        marginRight: 10,
        color: '#6B5A8E',
      },
    statsLabelText: {
        fontWeight: 'bold',
        color: 'gray',
    },
});    