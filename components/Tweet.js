import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import IconButton from './IconButton';
import { Entypo } from '@expo/vector-icons';
import Avatar from './Avatar';
import { useColorScheme } from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';

const Tweet = ({ tweet }) => {
  const navigation = useNavigation();
  const colorScheme = useColorScheme();

  if (!tweet) {
    return null;
  }

  const { user, content, image, numberOfComments, numberOfRetweets, numberOfLikes, impressions } = tweet;

  const handlePress = () => {
    navigation.navigate('TweetById', { tweetId: tweet.id });
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
    <Pressable style={styles.container} onPress={handlePress}>
      <Avatar user={tweet.user}/>

      <View style={styles.mainContainer}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.username}>{user.username} · 2h</Text>
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
          {numberOfComments && (
            <IconButton icon="comment" text={numberOfComments} />
          )}
          {numberOfRetweets && (
            <IconButton icon="retweet" text={numberOfRetweets} />
          )}
          {numberOfLikes && (
            <IconButton icon="heart" text={numberOfLikes} />
          )}
          {(impressions || impressions === 0) && (
            <IconButton icon="chart" text={impressions} />
          )}
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

  // footer
  footer: {
    flexDirection: 'row',
    marginVertical: 5,
    justifyContent: 'space-between',
  },
});

export default Tweet;


