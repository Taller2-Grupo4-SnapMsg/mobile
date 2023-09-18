import { StyleSheet, FlatList, View, Image, Pressable  } from "react-native";
import React from 'react'; 
import { useNavigation } from '@react-navigation/native';

export default function Avatar({user}){

    const navigation = useNavigation();
  
    //const { id, user, content, image, numberOfComments, numberOfRetweets, numberOfLikes, impressions } = tweet;
  
    const handlePressAvatar = () => {
      navigation.navigate('ProfileScreen', { userId: user.id });
    };

  return (
    <Pressable onPress={handlePressAvatar}>
        {user.image && (
            <Image source={{ uri: user.image }} style={styles.userImage} />
        )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: 'white',
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
});

