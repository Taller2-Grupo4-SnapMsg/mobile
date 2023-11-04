import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Entypo } from '@expo/vector-icons';
import { conversationsRef } from '../../firebase';
import { query, orderByChild, equalTo, get, ref } from 'firebase/database';


export default Chats = () => { 
    const navigation = useNavigation();
  const contacts = [
    {
      id: 1,
      name: 'Mark Doe',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar7.png',
    },
    {
      id: 2,
      name: 'Clark Man',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar6.png',
    },
    {
      id: 3,
      name: 'Jaden Boor',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar5.png',
    },
    {
      id: 4,
      name: 'Srick Tree',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar4.png',
    },
    {
      id: 5,
      name: 'Erick Doe',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar3.png',
    },
    {
      id: 6,
      name: 'Francis Doe',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar2.png',
    },
    {
      id: 8,
      name: 'Matilde Doe',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar1.png',
    },
    {
      id: 9,
      name: 'John Doe',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar4.png',
    },
    {
      id: 10,
      name: 'Fermod Doe',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar7.png',
    },
    {
      id: 11,
      name: 'Danny Doe',
      status: 'active',
      image: 'https://bootdey.com/img/Content/avatar/avatar1.png',
    },
  ]

  const handlePressPlus = () => {
    navigation.push('NewChat');
  };

  //codigo para apenas entro, así veo mis convos
  // const yourUserID = 'your_user_id'; // Replace with your actual user ID

  // // Query the conversations where your user ID is involved (either in user1 or user2)
  // const conversationsQuery = query(conversationsRef, (orderByChild('user1').equalTo(yourUserID)).or(orderByChild('user2').equalTo(yourUserID));

  // // Retrieve the conversations
  // get(conversationsQuery)
  //   .then((snapshot) => {
  //     if (snapshot.exists()) {
  //       // The 'snapshot' contains conversations where your user ID is involved
  //       const conversations = Object.values(snapshot.val());
  //       // 'conversations' is an array containing the conversations
          //aca estan todas las conversaciones que puedo mostrar. Me las tengo que guardar para mostrar info de ellas!

  //     } else {
  //       // No conversations found
  //     }
  //   })
  //   .catch((error) => {
  //     // Handle the error
  //   });

  const renderItem = ({ item }) => {
    const handleChatPress = () => {

    //   // Retrieve the 20 most recent messages for the selected conversation
    // const conversationID = item.conversationID;

    // // Query the messages for the selected conversation
    // const messageQuery = query(
    //   conversationsRef.child(conversationID).child('messages'),
    //   orderByChild('timestamp'),
    //   limitToLast(20)
    // );

    // get(messageQuery)
    //   .then((snapshot) => {
    //     if (snapshot.exists()) {
    //       const messages = Object.values(snapshot.val());

    //       // Navigate to 'SpecificChat' with the messages as a parameter
    //       navigation.push('SpecificChat', { messages: messages, conversationID:  conversationID});
    //     } else {
    //       // No messages found
    //       navigation.push('SpecificChat', { messages: [], conversationID: conversationID });
    //     }
    //   })
    //   .catch((error) => {
    //     // Handle the error
    //   });

    navigation.push('SpecificChat', { messages: [], conversationID: 12_34 });
    };

    return (
      <TouchableOpacity onPress={handleChatPress}>
        <View style={styles.row}>
          <Image source={{ uri: item.image }} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
                {item.name}
              </Text>
              <Text style={styles.mblTxt}>Mobile</Text>
            </View>
            <View style={styles.msgContainer}>
              <Text style={styles.msgTxt}>{item.status}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={contacts}
        keyExtractor={item => {
          return item.id.toString(); // Make sure to convert the ID to a string
        }}
        renderItem={renderItem} // Use the renderItem function directly
      />
      <Pressable style={styles.floatingButton} onPress={handlePressPlus}>
      <Entypo
        name="plus"
        size={24}
        color="white"
      />
    </Pressable>
    </View>
    
  );
};


const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    padding: 10,
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  mblTxt: {
    fontWeight: '200',
    color: '#777',
    fontSize: 13,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  msgTxt: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
  floatingButton: {
    backgroundColor: '#B8ADCC',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: 25,
    bottom: 55,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
})