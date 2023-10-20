import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';

const LikeButton = ({ icon, initialLikes, isLiked }) => {
  const [liked, setLiked] = useState(isLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleLikePress = () => {
    if (liked) {
      setLikes(likes - 1);
      setLiked(false);
    } else {
      setLikes(likes + 1);
      setLiked(true);
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