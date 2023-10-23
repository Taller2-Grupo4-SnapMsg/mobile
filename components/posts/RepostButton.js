import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import RepostPost from '../../handlers/posts/repost';
import DeleteRepostByPostId from '../../handlers/posts/deleteRepostByPostId';

const RepostButton = ({ icon, 
                        initialReposts, 
                        isReposted, 
                        post_id, 
                        setAlertMessage,
                        setAlertMessageColor}) => {

  const [reposted, setReposted] = useState(isReposted);
  const [reposts, setReposts] = useState(initialReposts);

  const setAlert = (message, color, timeout) => {
    setAlertMessageColor(color);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertMessageColor(null);
    }, timeout);
  }

  const handlePressRepost = async () => {
    try {
      if (reposted){
        response = await DeleteRepostByPostId(post_id);
        if (response == 200) {
          setReposts(reposts - 1);
          setReposted(false);
          Alert.alert('Success', 'Repost deleted successfully');
        } else if (response === 403) {
          setAlert("You can't delete a post with this button", SOFT_RED, TIMEOUT_ALERT);
        } else if (response === 404) {
          Alert.alert('Alert', 'The post you are trying to delete your repost from doesnt exist');
        } else {
          Alert.alert('Alert', 'Unknown error');
        }
      } else {
        response = await RepostPost(post_id);
        if (response){
          if (response === 200) {
            setReposts(reposts + 1);
            setReposted(true);
          } else if (response === 403) {
            setAlert("you can't repost a private post", SOFT_RED, TIMEOUT_ALERT);
          } else if (response === 409) {
            Alert.alert('Alert', 'You cannot repost your own posts');
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 90 }}>
      <TouchableOpacity onPress={handlePressRepost}>
        {reposted ? (
          <AntDesign name={icon} size={20} color="#6B5A8E" />
        ) : (
          <AntDesign name={icon} size={20} color="gray" />
        )}
      </TouchableOpacity>
      <Text style={{ fontSize: 15, color: 'gray', marginLeft: 5 }}>{reposts}</Text>
    </View>
  );
};

export default RepostButton;

