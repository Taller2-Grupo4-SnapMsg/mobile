import React from 'react';
import { Text, StyleSheet, Pressable, View } from 'react-native';
import { useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';

const TrendingTopic = ({ item }) => {
  const navigation = useNavigation();

  if (!item) return null;

  const { trending_topic, number_of_posts } = item;
  const colorScheme = useColorScheme();

  const handlePressTrendingTopic = () => {
    navigation.navigate('Trending Topic', { trending_topic: trending_topic });
    return;
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
      <Pressable
        style={({ pressed }) => [
          styles.containerStylePost,
          pressed && { opacity: 0.5 },
        ]}
        onPress={handlePressTrendingTopic}
      >
        <View style={styles.container2}>
          <View style={styles.container}>
            <View style={styles.iconContainer}>
              <Text style={styles.hashtag}>#</Text>
            </View>
            <Text style={styles.text}>{trending_topic}</Text>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.postCount}>{number_of_posts} Snaps</Text>
          </View>
        </View>
      </Pressable>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  containerStylePost: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 40,
    paddingTop: 25,
    paddingBottom: 35,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  container2: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 16,
  },
  hashtag: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B5A8E',
  },
  textContainer: {
    flex: 1,
    paddingTop: 40,
    position: 'absolute',
    left: 280,
    flexDirection: 'column',
  },
  text: {
    fontSize: 24,
    color: '#6B5A8E',
  },
  postCount: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#5A5A80',
  },
});

export default TrendingTopic;

