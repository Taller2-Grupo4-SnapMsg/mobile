import { StyleSheet, FlatList, View, Image, Pressable  } from "react-native";
import React from 'react'; 
import { useNavigation } from '@react-navigation/native';

export default function Avatar({user}){

  const navigation = useNavigation();

  const handlePressAvatar = () => {
    navigation.push('Profile', { user_param: user })
  };

  return (
    <Pressable onPress={handlePressAvatar}>
        {user.avatar && (
            <Image source={{ uri: user.avatar }} style={styles.userImage} />
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

