import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import RepostPost from '../../handlers/posts/repost';


const RepostButton = ({ icon, 
                        initialReposts, 
                        isReposted, 
                        post_id, 
                        setMessageRepost,
                        setMessageRepostColor}) => {

  //console.log("is reposted",isReposted)
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
      response = await RepostPost(post_id);
      console.log(response)
      if (response) {
        setReposts(reposts + 1);
        setReposted(true);
      } else {
        setAlert("The user is private", SOFT_RED, TIMEOUT_ALERT);
      }
    } catch (error) {
      console.error(error);
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

