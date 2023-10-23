import React from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {useState, useEffect} from 'react'; 
import { View, Text, Image, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import Avatar from '../Avatar';
import RepostButton from './RepostButton';
import LikeButton from './LikeButton';

import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';

const Post = ({ post, setMessageRepost, setMessageRepostColor}) => {
  if (!post)
    return null;

  var {post_id, 
      user_poster, 
      user_creator,
      created_at, 
      text, 
      image, 
      number_likes, 
      number_reposts, 
      hashtags, 
      did_i_like, 
      did_i_repost} = post;
  
  const colorScheme = useColorScheme();
  const [isReposted, setIsReposted] = useState(did_i_repost);
  
  const getImageURI = async (file_route) => {
    const storageRef = ref(storage, file_route);
    const downloadURL = await getDownloadURL(storageRef);
    return decodeURIComponent(downloadURL);
  }
  

  function formatDate(dateString) {
    // Split the date and time parts
    const [datePart, timePart] = dateString.split(' ');
  
    // Extract milliseconds (if present) and convert to a three-digit string
    const milliseconds = timePart.split('.')[1] || '000';
    const millisecondsString = milliseconds.slice(0, 3);
  
    // Concatenate the date and time parts in ISO 8601 format
    return `${datePart}T${timePart.split('.')[0]}.${millisecondsString}Z`;
  }

  const handlePressPost = () => {
    navigation.navigate('PostDetailed', { postId: post.post_id });
    return;
  };
  all_hours = Math.floor((new Date() - new Date(formatDate(created_at)))/ (1000 * 60 * 60));
  days = Math.floor(all_hours / 24);
  hours = all_hours - days * 24;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <Pressable
        style={
          user_poster.email == user_creator.email
            ? styles.containerStylePost
            : styles.containerStyleRepost
        }
        onPress={handlePressPost}
      >
      <Avatar user={user_creator} />
      <View style={styles.mainContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{user_creator.name}</Text>
            <Text style={styles.username}>{user_creator.username} · {days}d {hours}h</Text>
          </View>
        </View>

        <View style={styles.tagsContainer}>
          {hashtags && hashtags.map((tag) => (
            <View style={styles.tag} key={tag}>
              <Text style={styles.tagName}>{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.content}>{text}</Text>
        {image && (
          <Image source={{ uri: getImageURI(image) }} style={styles.image} />
        )}

        <View style={styles.footer}>
          <RepostButton icon="retweet" initialReposts={number_reposts} isReposted={isReposted} post_id={post_id} 
          setMessageRepost={setMessageRepost} setMessageRepostColor={setMessageRepostColor}/>
          <LikeButton icon="heart" initialLikes={number_likes} isLiked={did_i_like} post_id={post_id}/>
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
    marginTop: 10,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 10,
    color: 'gray',
    marginLeft: 5,
  },
  content: {
    lineHeight: 20,
    marginTop: 5,
    marginBottom: 5,
  },
  tagsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#6B5A8E',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  tagName: {
    color: 'white',
    marginRight: 5,
    fontSize: 12,
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