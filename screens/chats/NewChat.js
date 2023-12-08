import React from 'react'
import { useState, useEffect } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, 
  Keyboard } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import SearchBar from '../../components/SearchBar';
import searchUserByUsername from '../../handlers/searchUserByUsername';
import { useUser } from '../../contexts/UserContext';
import { db } from '../../firebase';
import { ref } from 'firebase/database';
import { query, orderByChild, limitToLast, get, set, serverTimestamp } from 'firebase/database';

const AMOUNT_USERS = 5;

export default NewChat = () => { 
    const navigation = useNavigation();
    const { loggedInUser } = useUser();
    const [usernameSearched, setUsernameSearched] = useState("");
    const [users, setUsers] = useState([]);
    const [offset, setOffset] = useState(0);
    const [showMore, setShowMore] = useState(false);

    function generateChatID(user1, user2) {
      // Sort user IDs alphabetically to ensure consistency
      const sortedUserIDs = [user1, user2].sort();
      return `${sortedUserIDs[0].replace(/[\.\#\$\/\[\]]/g, '_')}_${sortedUserIDs[1].replace(/[\.\#\$\/\[\]]/g, '_')}`;
    }

  const renderItem = ({ item }) => {
    const handleChatPress = () => {
      const chatID = generateChatID(loggedInUser.email, item.email);
      const chat = ref(db, `chats/${chatID}`);

      get(chat)
        .then((snapshot) => {
          if (snapshot.exists()) {
            // The chat exists, you can proceed with the query
            const chatRef = ref(db, `chats/${chatID}/messages`); // Navigate to the 'messages' node
            const messageQuery = query(
              chatRef,
              orderByChild('timestamp'),
              limitToLast(20)
            );
            // The chat already exists; handle it as needed
            get(messageQuery)
            .then((snapshot) => {
              if (loggedInUser.email == item.user1Email){
                user_sender = loggedInUser.email;
                user_receiver = item.user2Email;
              }
              if (loggedInUser.email == item.user2Email){
                user_sender = loggedInUser.email;
                user_receiver = item.user1Email;
              }
              if (snapshot.exists()) {
                const messages = Object.values(snapshot.val());
                // navigation.push('SpecificChat', { chatID: chatID });
                 
                console.log("\n\nEN NEW CHAT")
                console.log("chatID: ", chatID);
                console.log("user_receiver: ", user_receiver);
                console.log("user_sender: ", user_sender);
                navigation.push('SpecificChat', { chatID:  chatID, 
                  user_sender: user_sender, 
                  user_receiver: user_receiver});
              } else {
                // No messages found
                // navigation.push('SpecificChat', { chatID: chatID });
 
                console.log("\n\nEN NEW CHAT")
                console.log("chatID: ", chatID);
                console.log("user_receiver: ", user_receiver);
                console.log("user_sender: ", user_sender);
                
                navigation.push('SpecificChat', { chatID:  chatID, 
                  user_sender: user_sender, 
                  user_receiver: user_receiver});
                }
            })
            .catch((error) => {
              console.error("hubo un error al crear la conver3!! ", error);
              // Handle the error
            });
            
          } else {
            // The chat doesn't exist; create it
            const currentTimestamp = serverTimestamp();
            set(chat, {
              chatID: chatID,
              user1Email: loggedInUser.email,
              user2Email: item.email,
              user1Username: loggedInUser.username,
              user2Username: item.username,
              user1Avatar: loggedInUser.avatar,
              user2Avatar: item.avatar,
              timestamp: currentTimestamp,
              messages: [],
            }).then(() => {
              // chat created successfully
              console.log("\n\nEN NEW CHAT")
              console.log("chatID: ", chatID);
              console.log("user_receiver: ", item.email);
              console.log("user_sender: ", loggedInUser.email);
              navigation.push('SpecificChat', { chatID:  chatID, 
                user_sender: loggedInUser.email, 
                user_receiver: item.email});
            }).catch((error) => {
              console.log("hubo un error al crear la conver!!");
              // Handle the error
            });
          }
        })
        .catch((error) => {
          console.error("hubo un error al crear la conver2!! ", error);
          // Handle the error
        });
    };

    return (
      <TouchableOpacity onPress={handleChatPress}>
        <View style={styles.row}>
          <Image source={{ uri: item.avatar }} style={styles.pic} />
          <View>
            <View style={styles.nameContainer}>
              <Text style={styles.nameTxt} numberOfLines={1} ellipsizeMode="tail">
                {item.username}
              </Text>
              <Text style={styles.mblTxt}>Mobile</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const handleSearchByUsername = async (offset_param, prevUsers) => {

    user_data = await searchUserByUsername(usernameSearched, offset_param, AMOUNT_USERS, false, navigation);
    setOffset(offset_param);

    const newUsers = [];

    user_data.forEach((userData) => {
      const newUser = { 
        email: userData.email,
        username: userData.username,
        avatar: userData.avatar,
      };

      newUsers.push(newUser);
    });

    if (newUsers.length < AMOUNT_USERS) {
      setShowMore(false);
    } else {
      setShowMore(true);
    }

    setUsers(prevUsers.concat(newUsers));
  }

  const handleSearchButtonFunction = async () => {
    Keyboard.dismiss();
    await handleSearchByUsername(0, []);
  };
   
  const handleSearchMoreButton = async () => {
    Keyboard.dismiss();
    await handleSearchByUsername(offset + AMOUNT_USERS, users);
  };

  return (
    <View style={{ flex: 1 }}>
      <SearchBar
        searchText={usernameSearched}
        setSearchText={setUsernameSearched}
        handleSearchButton={handleSearchButtonFunction}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item.email}
        renderItem={renderItem}
        ListFooterComponent={() => (
          showMore ? (
            <TouchableOpacity
              style={styles.showMoreButton}
              onPress={handleSearchMoreButton}
            >
              <Text style={{ color: 'white' }}>Show More</Text>
            </TouchableOpacity>
          ) : null
        )}
      />
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
  showMoreButton: {
    alignSelf: 'center', 
    paddingHorizontal: 14,
    paddingVertical: 5,
    backgroundColor: '#6B5A8E',
    borderRadius: 50,
    marginTop: 20,
    marginBottom: 40,
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
  }
})