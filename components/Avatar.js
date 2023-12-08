import { StyleSheet, FlatList, View, Image, Pressable  } from "react-native";
import React from 'react'; 
import { useNavigation } from '@react-navigation/native';
import getUserByUsername from "../handlers/getUserByUsername";

export default function Avatar({user}){

  const navigation = useNavigation();

  const handlePressAvatar = async () => {
    profile_user = await getUserByUsername(user.username);
    navigation.push('Profile', { user_param: profile_user })
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

