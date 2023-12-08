import React from 'react';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {useState, useEffect} from 'react'; 
import { View, Text, Image, StyleSheet, Pressable , TouchableOpacity } from 'react-native';
import { useColorScheme } from 'react-native';
import Avatar from '../Avatar';
import RepostButton from './RepostButton';
import LikeButton from './LikeButton';
import FavoriteButton from './FavoriteButton';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext';
import PostPictureModal from '../PostPictureModal';
import { useNavigation } from '@react-navigation/native';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';
import getUserByUsername from '../../handlers/getUserByUsername';

const Post = ({ post, setAlertMessage, setAlertMessageColor, setRefreshing}) => {
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
      did_i_repost,
      did_i_put_favorite} = post;
  
  const colorScheme = useColorScheme();
  const navigation = useNavigation();
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
  
  // Call the function when the component mounts
  useFocusEffect(
    React.useCallback(() => {
      fetchImageURL();
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchImageURL();
    }, [post.image])
  );

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
    //navigation.navigate('PostDetailed', { post_id: post.post_id, setRefreshing: setRefreshing });
    return;
  };

  const handleMentionUserPressed = async (username) => {
    profile_user = await getUserByUsername(username);
    navigation.push('Profile', { user_param: profile_user });
  };

  
  all_hours = Math.floor((new Date() - new Date(formatDate(created_at)))/ (1000 * 60 * 60));
  days = Math.floor(all_hours / 24);
  hours = all_hours - days * 24;

  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  }
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
              <Text style={styles.tagName}>#{tag}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.content}>{text}</Text>
        <View style={styles.tagsContainer} >
            {mentions && mentions.map((mention) => (
              <TouchableOpacity key={mention} onPress={() => handleMentionUserPressed(mention)} styles={styles.mentionsButton}>
                <Text style={styles.mentions} >{" @"}{mention}{" "}</Text>
              </TouchableOpacity>
            ))}
        </View>
        {post.image && (
            <TouchableOpacity onPress={toggleModal}>
            <Image
              style={styles.image}
              source={{
                uri: imageURI,
              }}
            />
            </TouchableOpacity>
        )}

          <PostPictureModal
                isVisible={isModalVisible}
                imageUrl={imageURI}
                onClose={toggleModal}
              />


        <View style={styles.footer}>
          <RepostButton
            icon="retweet"
            initialReposts={number_reposts}
            isReposted={did_i_repost}
            post_id={post_id}
            setAlertMessage={setAlertMessage}
            setAlertMessageColor={setAlertMessageColor}
            disabled={user_creator.email === loggedInUser.email}
            setRefreshing={setRefreshing}
          />
          
          <LikeButton icon="heart" initialLikes={number_likes} isLiked={did_i_like} post_id={post_id} setRefreshing={setRefreshing} />

          <FavoriteButton icon="star" isFavorited={did_i_put_favorite} post_id={post_id} setRefreshing={setRefreshing}/>
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
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 5,
  },
  tag: {
    backgroundColor: '#6B5A8E', 
    borderRadius: 5, 
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 2,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 40,
    marginLeft: 5,
  },
  mentions: {
    alignItems: 'baseline',
    color: '#6B5A8E',
    fontWeight: 'bold',
  },
  mentionsButton: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    backgroundColor: '#ecf0f1',
  },
});

export default Post;
