import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import RepostPost from '../../handlers/posts/repost';
import DeleteRepostByPostId from '../../handlers/posts/deleteRepostByPostId';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext';

const RepostButton = ({ icon,
                        initialReposts, 
                        isReposted,
                        post_id, 
                        setAlertMessage,
                        setAlertMessageColor, 
                        disabled,
                        setRefreshing }) => {

  const [reposted, setReposted] = useState(isReposted);
  const [reposts, setReposts] = useState(initialReposts);
  const navigation = useNavigation();
  const { loggedInUser, refreshingHome, setRefreshingHome } = useUser();
  const setAlert = (message, color, timeout) => {
    setAlertMessageColor(color);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertMessageColor(null);
    }, timeout);
  }

  useFocusEffect(
    React.useCallback(() => {
      setReposted(isReposted);
      setReposts(initialReposts);
    }, [isReposted, initialReposts])
  );

  const handlePressRepost = async () => {
    try {
      if (reposted){
        response = await DeleteRepostByPostId(post_id, navigation);
        if (response == 200) {
          setReposts(reposts - 1);
          setReposted(false);
        } 
      } else {
        response = await RepostPost(post_id, navigation);
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
      //setRefreshing(true);
      setRefreshingHome(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 60 }}>
     <TouchableOpacity onPress={handlePressRepost} disabled={disabled}>
        {reposted ? (
          <AntDesign name={icon} size={24} color={disabled ? "dimgray" : "#6B5A8E"} />
        ) : (
          <AntDesign name={icon} size={24} color={disabled ? "dimgray" : "gray"} />
        )}
      </TouchableOpacity>
      <Text style={{ fontSize: 15, color: 'gray', marginLeft: 5 }}>{reposts}</Text>
    </View>
  );
};

export default RepostButton;

