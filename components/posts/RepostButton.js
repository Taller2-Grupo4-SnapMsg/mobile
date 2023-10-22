import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import RepostPost from '../../handlers/posts/repostPost';
import UndoRepostPost from '../../handlers/posts/getReposts';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

const RepostButton = ({ icon, initialReposts, isReposted, post_id}) => {
  const [reposted, setReposted] = useState(isReposted);
  const [reposts, setReposts] = useState(initialReposts);
  //const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);

  const handlePressRepost = async () => {
    try {
    if (reposted) {
      console.log("entra a dejar de repostear:", post_id)
      //setSuccessAlertVisible(true);
      //setReposts(reposts - 1);
      //await UndoRepostPost(post_id);
      //setReposted(false);
    } else {
      console.log("entra a repostear:", post_id)
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
    {/*<Dialog
          isVisible={isSuccessAlertVisible}
          message="Si quieres eliminar un repost debes hacerlo desde tu perfil"
          onClose={() => setSuccessAlertVisible(false)}
        />*/}
    </View>
  );
};

export default RepostButton;
