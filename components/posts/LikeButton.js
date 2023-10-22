import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import LikePost from '../../handlers/posts/likePost';
import UnlikePost from '../../handlers/posts/unlikePost';

const LikeButton = ({ icon, initialLikes, isLiked, post_id }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleLikePress = async () => {
    try {
      if (liked) {
        setLikes(likes - 1);
        setLiked(false);
        response = await UnlikePost(post_id);
      } else {
        setLikes(likes + 1);
        setLiked(true);
        response = await LikePost(post_id);
      }
    }catch (error) {
      console.error('Error while liking:', error);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={handleLikePress}>
        {liked ? (
            <AntDesign name="heart" size={27} color="#FF5733" />
          ) : (
            <AntDesign name="hearto" size={27} color="gray" />
          )}
      </TouchableOpacity>
      <Text style={{ fontSize: 15, color: 'gray', marginLeft: 5 }}>{likes}</Text>
    </View>
  );
};

export default LikeButton;