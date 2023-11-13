import { View, Text, StyleSheet} from 'react-native';
import { useColorScheme } from 'react-native';
import Post from '../../components/posts/Post';
import React, { useState, useEffect } from 'react';
import getPostById from '../../handlers/posts/getPostById';
import Spinner from 'react-native-loading-spinner-overlay';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';

const NotificationMention = ({ message, data, read }) => {
  const [post, setPost] = useState(null);
  const [isFetchingPost, setIsFetchingPost] = useState(false);
  
  useEffect(() => {
    const fetchPostById = async () => {
      if (data && data.post_id) {
        console.log("entra a fetchPostById")
        setIsFetchingPost(true);
        const postId = parseInt(data.post_id, 10);

        try {
          console.log(data.post_id)
          const fetchedPost = await getPostById(postId);
          console.log(fetchedPost)
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
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
          <View style={styles.container}>
              <View style={styles.container_reposted}>
                  <Text style={styles.name}>You have been mentioned</Text>
              </View>
          
              <View>
              <Post post={post[0]} />
              </View>
          </View>
          
        </ThemeProvider>
      );
  }
  };

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 10,
    //borderBottomWidth: StyleSheet.hairlineWidth,
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
    marginTop: 10,
    fontWeight: 'bold',
  },
  username: {
    marginTop: 10,
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
  }
});

export default NotificationMention;