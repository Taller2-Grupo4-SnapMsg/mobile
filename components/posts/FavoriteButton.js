import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import UnFavoritePost from '../../handlers/posts/unfavoritePost';
import FavoritePost from '../../handlers/posts/favoritePost';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext';
const FavoriteButton = ({ icon,  isFavorited, post_id }) => {
  const [favorited, setFavorited] = useState(isFavorited);
  const navigation = useNavigation();
  const { loggedInUser } = useUser();
  useFocusEffect(
    React.useCallback(() => {
      setFavorited(isFavorited);
    }, [isFavorited])
  );

  const handleFavoritePress = async () => {
    try {
      if (favorited) {
        setFavorited(false);
        response = await UnFavoritePost(post_id, navigation);
      } else {
        setFavorited(true);
        response = await FavoritePost(post_id, navigation);
      }
    }catch (error) {
      console.error('Error while liking:', error);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={handleFavoritePress}>
        {favorited ? (
            <AntDesign name="star" size={25} color="#E48C10" />
          ) : (
            <AntDesign name="staro" size={25} color="gray" />
          )}
      </TouchableOpacity>
    </View>
  );
};

export default FavoriteButton;