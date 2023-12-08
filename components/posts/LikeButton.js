import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import LikePost from '../../handlers/posts/likePost';
import UnlikePost from '../../handlers/posts/unlikePost';
import { useFocusEffect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext';

const LikeButton = ({ icon, initialLikes, isLiked, post_id, setRefreshing }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);
  const { loggedInUser, refreshingHome, setRefreshingHome } = useUser();
  const navigation = useNavigation();
  useFocusEffect(
    React.useCallback(() => {
      setLiked(isLiked);
      setLikes(initialLikes);
    }, [isLiked, initialLikes])
  );

  const handleLikePress = async () => {
    try {
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
        response = await UnlikePost(post_id, navigation);
      } else {
        setLikes(likes + 1);
        setLiked(true);
        response = await LikePost(post_id, navigation);
      }
      setRefreshingHome(true);
    }catch (error) {
      console.error('Error while liking:', error);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 60 }}>
      <TouchableOpacity onPress={handleLikePress}>
        {liked ? (
            <AntDesign name="heart" size={22} color="#E1306C" />
          ) : (
            <AntDesign name="hearto" size={22} color="gray" />
          )}
      </TouchableOpacity>
      <Text style={{ fontSize: 15, color: 'gray', marginLeft: 5 }}>{likes}</Text>
    </View>
  );
};

export default LikeButton;