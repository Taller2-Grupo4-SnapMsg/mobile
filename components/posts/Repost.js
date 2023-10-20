import React from 'react';
import {useState, useEffect} from 'react'; 
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from '../IconButton';
import { useColorScheme } from 'react-native';

import LikePost from '../../handlers/posts/likePost';
import DislikePost from '../../handlers/posts/dislikePost';
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

  //console.log()

  var {content, hashtags, id, image, number_likes, number_reposts, posted_at, user, user_repost} = post;

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
        <Pressable style={styles.container_post} onPress={handlePressPost}>
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
                    <IconButton icon="retweet" text={Number(number_reposts)} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handlePressLike(id)}>
                    <IconButton icon="heart" text={Number(number_likes)} pressed={postLiked}/>
                </TouchableOpacity>
                </View>
                </View>
        </Pressable>
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
  container_post: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 15,
    margin: 10,
  },
  container_reposted: {
    flexDirection: 'row',
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 50,
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

export default Repost;