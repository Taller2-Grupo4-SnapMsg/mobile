import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const RepostButton = ({ icon, initialReposts, isReposted}) => {
  const [reposted, setReposted] = useState(isReposted);
  const [reposts, setReposts] = useState(initialReposts);

  const handleRepostPress = () => {
    if (reposted) {
      setReposts(reposts - 1);
      setReposted(false);
    } else {
      setReposts(reposts + 1);
      setReposted(true);
    }
  };

  //no me funciona el tema de la sombra, lo tengo que solucionar
  return (
      <TouchableOpacity
        onPress={handleRepostPress}
        activeOpacity={0.2}
        style={{
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowOffset: { width: 2, height: 2 },
          shadowRadius: 4,
          shadowOpacity: 1,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 90 }}>
          {reposted ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                shadowColor: 'rgba(0, 0, 0, 0.2)',
                shadowOffset: { width: 2, height: 2 },
                shadowRadius: 4,
                shadowOpacity: 1,
              }}
            >
              <AntDesign
                name={icon}
                size={30}
                color="black"
                style={{ fontWeight: 'bold' }}
              />
            </View>
          ) : (
            <AntDesign name={icon} size={30} color="gray" />
          )}
          <Text style={{ fontSize: 15, color: 'gray', marginLeft: 5 }}>{reposts}</Text>
        </View>
      </TouchableOpacity>
  );
};

export default RepostButton;
