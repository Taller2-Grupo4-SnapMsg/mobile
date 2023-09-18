import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { useRoute } from '@react-navigation/native';
import tweets from '../assets/data/tweets';
import Tweet from '../components/Tweet'

const TweetScreen = () => {
  const route = useRoute();
  const { tweetId } = route.params;

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    return <Text>Tweet {tweetId} not found!</Text>;
  }

  return <Tweet tweet={tweet} />;
};

export default TweetScreen;