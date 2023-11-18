import React from 'react';
import { storage } from '../../firebase';
import { ref, getDownloadURL } from "firebase/storage";
import {useState} from 'react'; 
import { View, Text, Image, StyleSheet} from 'react-native';
import { useColorScheme } from 'react-native';
import Avatar from '../Avatar';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';

const NotificationPost = ({ post,}) => {
  if (!post)
    return null;
    
  const {loggedInUser} = useUser();
  var {post_id, 
      user_poster, 
      user_creator,
      created_at, 
      text, 
      number_likes, 
      number_reposts, 
      hashtags, 
      mentions,
      did_i_like, 
      did_i_repost} = post;
  
  const colorScheme = useColorScheme();
  const [imageURI, setImageURI] = useState(null);
  
  const fetchImageURL = async () => {
    try {
      if (!post.image) {
        return;
      }
      const decoded_file_route = decodeURIComponent(post.image);
      const storageRef = ref(storage, decoded_file_route);
      const url = await getDownloadURL(storageRef);
      setImageURI(url);
    } catch (error) {
      console.error('Error fetching image URL:', error);
    }
  };
  
  useFocusEffect(
    React.useCallback(() => {
      fetchImageURL();
    }, [])
  );
  
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <View style={styles.containerStylePost}>

      <Avatar user={user_creator} />

      <View style={styles.mainContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.name}>{user_creator.name}</Text>
            <Text style={styles.username}>{user_creator.username} · {days}d {hours}h</Text>
          </View>
        </View>
        <Text style={styles.content}>{text}</Text>
      </View>

      {post.image && (
          <Image
            style={styles.image}
            source={{
              uri: imageURI,
            }}
          />
      )}

      </View>
    </ThemeProvider>
    );
  };

const styles = StyleSheet.create({
  containerStylePost: {
    paddingHorizontal: 20,
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
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
    marginBottom: 5,
  },
  image: {
    height: 50,
    width: 50,
  },
  footer: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'center',
    paddingRight: 25,
  }
});

export default NotificationPost;
