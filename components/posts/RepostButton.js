import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import RepostPost from '../../handlers/posts/repostPost';


const RepostButton = ({ icon, 
                        initialReposts, 
                        isReposted, 
                        post_id, 
                        setMessageRepost,
                        setMessageRepostColor}) => {
  const [reposted, setReposted] = useState(isReposted);
  const [reposts, setReposts] = useState(initialReposts);

  const setAlert = (message, color, timeout) => {
    setMessageRepostColor(color);
    setMessageRepost(message);
    setTimeout(() => {
      setMessageRepost(null);
      setMessageRepostColor(null);
    }, timeout);
  }

  const handlePressRepost = async () => {
    try {
      if (reposted) {
        setAlert("no se puede", SOFT_RED, TIMEOUT_ALERT)
      } else {
        console.log("entra a repostear:", post_id);
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
          <AntDesign name={icon} size={27} color="black" />
        ) : (
          <AntDesign name={icon} size={27} color="gray" />
        )}
      </TouchableOpacity>
      <Text style={{ fontSize: 15, color: 'gray', marginLeft: 5 }}>{reposts}</Text>
    </View>
  );
};

export default RepostButton;

