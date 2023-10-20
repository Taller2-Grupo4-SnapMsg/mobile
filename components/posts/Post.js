import React from 'react';
import {useState, useEffect} from 'react'; 
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from './LikeButton';
import { useColorScheme } from 'react-native';

import LikePost from '../../handlers/posts/likePost';
import UnlikePost from '../../handlers/posts/unlikePost';
import RepostPost from '../../handlers/posts/repostPost';
import UndoRepostPost from '../../handlers/posts/undoRepostPost';
import Avatar from '../Avatar';
import LikeButton from './LikeButton';
import RepostButton from './RepostButton';

import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';

const Post = ({ post }) => {
  if (!post)
    return null;

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const myPost = true;

  //console.log()

  var {content, hashtags, id, image, number_likes, number_reposts, posted_at, user, user_repost} = post;

  //const [isLiked, setIsLiked] = useState(isLiked);
  const [isLiked, setIsLiked] = useState(false);
  //const [isReposted, setIsReposted] = useState(isReposted);
  const [isReposted, setIsReposted] = useState(false);

  const handlePressPost = () => {
    //comento para en ios no quedarme estancada :D
    //navigation.navigate('PostDetailed', { postId: post.id });
    return;
  };

  const handlePressRepost = async (post_id) => {
    try {
      if (isReposted == false) {
        await RepostPost(post_id);
        setIsReposted(true);
      }
      else {
        await UndoRepostPost(post_id);
        setIsReposted(false);
      }
    } catch (error) {
      console.error('Error while reposting:', error);
    }
  };

  const handlePressLike = async (post_id) => {
  try {
    if (isLiked == false) {
      await LikePost(post_id);
      setIsLiked(true);
    }
    else {
      await UnlikePost(post_id);
      setIsLiked(false);
    }
  } catch (error) {
    console.error('Error while liking:', error);
  }
};

  all_hours = Math.floor((new Date() - new Date(posted_at))/ (1000 * 60 * 60))
  days = Math.floor(all_hours / 24)
  hours =  all_hours - days * 24

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <Pressable
        style={
          post.user_repost.id === -1
            ? styles.containerStylePost
            : styles.containerStyleRepost
        }
        onPress={handlePressPost}
      >
      <Avatar user={user} />
      <View style={styles.mainContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username} ·{days}d {hours}h</Text>
          </View>
        </View>

        <Text style={styles.content}>{content}</Text>
        {image && (
          <Image source={{ uri: decodeURIComponent(image) }} style={styles.image} />
        )}
        <View style={styles.footer}>
          <TouchableOpacity onPress={() => handlePressRepost(id)}>
            <RepostButton icon="retweet" initialReposts={post.number_reposts} isReposted={isReposted}/>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePressLike(id)}>
            <LikeButton icon="heart" initialLikes={post.number_likes} isLiked={isLiked}/>
          </TouchableOpacity>
        </View>
        </View>
        </Pressable>
    </ThemeProvider>
    );
  };

const styles = StyleSheet.create({
  containerStylePost: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  containerStyleRepost: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
    margin: 10,
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
  content: {
    lineHeight: 20,
    marginTop: 5,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginVertical: 10,
    borderRadius: 15,
  },
  footer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    justifyContent: 'center',
  },
});

export default Post;
