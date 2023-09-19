import { StyleSheet, FlatList, View, Pressable  } from "react-native";
import { Entypo } from '@expo/vector-icons';
import { Link } from 'expo-router';
import tweets from "../../assets/data/tweets";
import React from 'react'; 
import Tweet from "../../components/Tweet";
import { useNavigation } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

export default function Home({}) {

  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('NewTweet');
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tweets}
        renderItem={({ item }) => item && <Tweet tweet={item} />}
      />
      <Pressable style={styles.floatingButton} onPress={handlePress}>
        <Entypo
          name="plus"
          size={24}
          color="white"
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: 'white',
  },
  floatingButton: {
    backgroundColor: '#1C9BF0',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 15,
    bottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  floatingButtonIcon: {
    color: 'white', // Color del icono
  },
});
