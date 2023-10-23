import React from 'react';
import { View, Text, StyleSheet} from 'react-native';
import { useColorScheme } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import Avatar from '../Avatar';
import Post from './Post';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';

const Repost = ({ post, setMessageRepost, setMessageRepostColor }) => {
  if (!post)
    return null;

  const colorScheme = useColorScheme();

  all_hours = Math.floor((new Date() - new Date(post.created_at))/ (1000 * 60 * 60))
  days = Math.floor(all_hours / 24)
  hours =  all_hours - days * 24

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <View style={styles.container}>
        <View style={styles.container_reposted}>
          <Avatar user={post.user_poster} />
            <View style={styles.mainContainer}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.name}>{post.user_poster.name}</Text>
                    <Text style={styles.username}>{post.user_poster.username} ·{days}d {hours}h</Text>
                    <View style={styles.repostContainer}>
                      <View style={styles.iconContainer}>
                        <AntDesign name={"retweet"} size={14} color="white" />
                      </View>
                      <Text style={styles.reposted_text}>Reposted</Text>
                    </View>
                  </View>
                </View>
            </View>
      
        </View>
          <Post post={post} setMessageRepost={setMessageRepost} setMessageRepostColor={setMessageRepostColor}/>
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

export default Repost;