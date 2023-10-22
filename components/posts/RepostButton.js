import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import RepostPost from '../../handlers/posts/repostPost';
import UndoRepostPost from '../../handlers/posts/getReposts';

const RepostButton = ({ icon, initialReposts, isReposted}) => {
  const [reposted, setReposted] = useState(isReposted);
  const [reposts, setReposts] = useState(initialReposts);

  const handlePressRepost = async (post_id) => {
    try {
    if (reposted) {
      setReposts(reposts - 1);
      await UndoRepostPost(post_id);
      setReposted(false);
    } else {
      setReposts(reposts + 1);
      await RepostPost(post_id);
      setReposted(true);
    }
  } catch (error) {
    console.error('Error while reposting:', error);
  }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 90 }}>
      <TouchableOpacity onPress={handlePressRepost}>
      {reposted ? (
          <AntDesign
            name={icon}
            size={30}
            color="black"
            style={{ fontWeight: 'bold' }}
          />
      ) : (
        <AntDesign name={icon} size={30} color="gray" />
      )}
      <Text style={{ fontSize: 15, color: 'gray', marginLeft: 5 }}>{reposts}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RepostButton;
