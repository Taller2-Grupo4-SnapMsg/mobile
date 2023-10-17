import React from 'react';
import {useState, useEffect} from 'react'; 
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from './IconButton';
import { Entypo } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import LikePost from '../handlers/posts/likePost';
import DislikePost from '../handlers/posts/dislikePost';
import RepostPost from '../handlers/posts/repostPost';
import UndoRepostPost from '../handlers/posts/undoRepostPost';

import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';

const Post = ({ post }) => {
  if (!post)
    return null;

  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  const [postLiked, setPostLiked] = useState(false);
  const [postReposted, setPostReposted] = useState(false);

  const {content, hashtags, id, image, number_likes, number_reposts, posted_at, user, user_repost} = post;

  const handlePressPost = () => {
    //comento para en ios no quedarme estancada :D
    //navigation.navigate('PostDetailed', { postId: post.id });
    return;
  };

  const handlePressRepost = async (post_id) => {
    try {
      if (postReposted == false) {
        await RepostPost(post_id);
        setPostReposted(true);
      }
      else {
        await UndoRepostPost(post_id);
        setPostReposted(false);
      }
    } catch (error) {
      console.error('Error while reposting:', error);
    }
  };

  const handlePressLike = async (post_id) => {
  try {
    if (postLiked == false) {
      await LikePost(post_id);
      setPostLiked(true);
    }
    else {
      await DislikePost(post_id);
      setPostLiked(false);
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
      <Pressable style={styles.container} onPress={handlePressPost}>
        
        <Image source={{ uri: user.avatar }} style={styles.userImage} />


        <View style={styles.mainContainer}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.username}>{user.username} ·{days}d {hours}h</Text>
            <Entypo
              name="dots-three-horizontal"
              size={16}
              color="gray"
              style={{ marginLeft: 'auto' }}
            />
          </View>

          <Text style={styles.content}>{content}</Text>


            {image && (
              <Image source={{ uri: decodeURIComponent(image) }} style={styles.image} />
            )}

          <View style={styles.footer}>
            <TouchableOpacity onPress={() => handlePressRepost(id)}>
              <IconButton icon="retweet" text={Number(number_reposts)} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePressLike(id)}>
              <IconButton icon="heart" text={Number(number_likes)} pressed={postLiked}/>
            </TouchableOpacity>

            <IconButton icon="share-apple" />
          </View>
          </View>
        </Pressable>
      </ThemeProvider>
    );
  };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
   // borderColor: 'lightgrey',
    //backgroundColor: 'white',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  mainContainer: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontWeight: '600',
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
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

export default Post;


