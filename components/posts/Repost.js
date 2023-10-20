import React from 'react';
import {useState, useEffect} from 'react'; 
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from './LikeButton';
import { useColorScheme } from 'react-native';
import Post from './Post';

import LikePost from '../../handlers/posts/likePost';
import DislikePost from '../../handlers/posts/unlikePost';
import RepostPost from '../../handlers/posts/repostPost';
import UndoRepostPost from '../../handlers/posts/undoRepostPost';
import Avatar from '../Avatar';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';

const Repost = ({ post }) => {
  if (!post)
    return null;

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [postLiked, setPostLiked] = useState(false);
  const [postReposted, setPostReposted] = useState(false);

  const myPost = true;

  var {content, hashtags, id, image, number_likes, number_reposts, posted_at, user, user_repost} = post;

  all_hours = Math.floor((new Date() - new Date(posted_at))/ (1000 * 60 * 60))
  days = Math.floor(all_hours / 24)
  hours =  all_hours - days * 24

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <View style={styles.container}>
        <View style={styles.container_reposted}>
          <Avatar user={user_repost} />
            <View style={styles.mainContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.name}>{user_repost.name}</Text>
                    <Text style={styles.username}>{user_repost.username} ·{days}d {hours}h</Text>
                    </View>
                </View>
            </View>
        </View>
          <Post post={post}/>
        </View>
    </ThemeProvider>
    );
  };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container_reposted: {
    flexDirection: 'row',
  },
  mainContainer: {
    marginLeft: 10,
    marginRight: 10,
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
  },
  username: {
    color: 'gray',
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    justifyContent: 'center',
  },
});

export default Repost;