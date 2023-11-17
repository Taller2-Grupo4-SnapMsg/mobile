import { View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import { useColorScheme } from 'react-native';
import Post from '../../components/posts/Post';
import NotificationPost from '../../components/posts/NotificationPost';
import React, { useState, useEffect } from 'react';
import getPostById from '../../handlers/posts/getPostById';
import Spinner from 'react-native-loading-spinner-overlay';
import { useNavigation } from '@react-navigation/native';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';


const NotificationMention = ({ message, data, read}) => {
  const [post, setPost] = useState(null);
  const [isFetchingPost, setIsFetchingPost] = useState(false);

  const navigation = useNavigation();

  const handlePressNotification = (data) => {
    navigation.navigate("PostDetailedNotification", { post_id: data.post_id });
  };
  
  useEffect(() => {
    const fetchPostById = async () => {
      if (data && data.post_id) {
        setIsFetchingPost(true);
        const postId = parseInt(data.post_id, 10);

        try {
          const fetchedPost = await getPostById(postId);
          setPost(fetchedPost);
        } catch (error) {
          console.error('Error while checking posts status:', error);
        } finally {
          setIsFetchingPost(false);
        }
      }
    };

    fetchPostById();
  }, []);

  const colorScheme = useColorScheme();

  if (isFetchingPost) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isFetchingPost}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  } if (post){
    return (
      <TouchableOpacity
      disabled={read}
      style={[styles.container, { opacity: read ? 0.5 : 1 }]}
      onPress={() => handlePressNotification(data)}
      >
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
          <View style={styles.container}>
              <View style={styles.container_reposted}> 
                <Icon name="at" size={16} color="blue" />
                  <Text style={styles.boldText}>Someone mentioned you in a snap!</Text>
              </View>
          
              <View>
              <NotificationPost post={post[0]} />
              </View>
          </View>
          
        </ThemeProvider>
        </TouchableOpacity>
      );
  }
  };

const styles = StyleSheet.create({
  container: {
    paddingVertical: 5,
    flexDirection: 'column',
  },
  container_reposted: {
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
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
    marginTop: 5,
    color: 'gray',
    marginLeft: 5,
  },
  footer: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    justifyContent: 'center',
  },
  repostContainer: {
    flexDirection: 'row',
    marginRight: 70,
    marginTop: 8,
    paddingLeft: 50,
    alignItems: 'center',
  },
  iconContainer: {
    width: 20,
    height: 20,
    backgroundColor: '#6B5A8E',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 50,
    marginRight: 20,
  },
  reposted_text: {
    color: 'gray',
    fontSize: 14,
  },
  boldText: {
    paddingHorizontal: 5,
    fontWeight: 'bold',
    color: 'blue',
  },

});

export default NotificationMention;