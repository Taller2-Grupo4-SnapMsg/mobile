import React, { useState, useRef, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import { TextInput } from 'react-native-paper';
import { useUser } from '../../contexts/UserContext';
import { db } from '../../firebase';
import {  ref, onValue, push, query, orderByChild, startAt } from 'firebase/database';
const { width, height } = Dimensions.get('window')


export default SpecificChat = ({ route }) => {
  const { loggedInUser } = useUser();
  const initialMessages = route.params.messages;
  const chatID = route.params.chatID;
  const [latestTimestamp, setLatestTimestamp] = useState(0); // Initialize with a timestamp (e.g., 0).

  const messagesRef = ref(db, `chats/${chatID}/messages`); // Navigate to the 'messages' node
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);

  
  //en el nuevo codigo no necesito un reply, necesito un listener que esté constantemente levantando data nueva de los msjs
  useEffect(() => {
    // Query for new messages with a timestamp greater than the latestTimestamp.
    const messagesQuery = query(
      messagesRef,
      orderByChild('timestamp'),
      startAt(latestTimestamp + 1)
    );

    const unsubscribe = onValue(messagesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const newMessages = snapshot.val();

        if (newMessages) {
          const newMessageArray = Object.values(newMessages);
          setMessages((prevMessages) => [...prevMessages, ...newMessageArray]);
          // Update the latest timestamp based on the newest message.
          const newestMessage = newMessageArray[newMessageArray.length - 1];
          setLatestTimestamp(newestMessage.timestamp);
        }
      }
    });

    return () => unsubscribe();
  }, [messagesRef, latestTimestamp]);

  

  const send = () => {
    if (newMessage.length > 0) {
      Keyboard.dismiss();
      const newDBMessage = {
        text: newMessage,
        sender: loggedInUser.email, //aca va siempre mi userId, porque soy el único que puede enviar en esta pantalla
        timestamp: Date.now(),
        avatar: loggedInUser.avatar,
      };

      // Push the new message to the messages array
      push(messagesRef, newDBMessage)
      .then(() => {
        // Message successfully added to the chat
        setNewMessage('')
      
        if (flatListRef.current) {
          flatListRef.current.scrollToEnd();
        }
      })
      .catch((error) => {
        // Handle the error, e.g., display an error message
      });
    }
  }

  const renderItem = ({ item }) => {
    if (item.sender === loggedInUser.email) {
      return (
        <View style={styles.rightMsg}>
          <View style={styles.rightBlock}>
            <Text style={styles.rightTxt}>{item.text}</Text>
          </View>
          <Image source={{ uri: loggedInUser.avatar }} style={styles.userPic} />
        </View>
      )
      
    } else {
      return (
        <View style={styles.eachMsg}>
          <Image source={{ uri: item.avatar }} style={styles.userPic} />
          <View style={styles.msgBlock}>
            <Text style={styles.msgTxt}>{item.text}</Text>
          </View>
        </View>
      )
    }
  }

  return (
    <KeyboardAvoidingView behavior="padding" enabled style={styles.container}> 
      <FlatList
        ref={flatListRef} // Add a ref to the FlatList
        style={styles.list}
        extraData={messages}
        data={messages}
        keyExtractor={(item) => item.timestamp}
        renderItem={renderItem}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.input}>
        <TextInput
          style={styles.inputText}
          placeholderTextColor="#696969"
          onChangeText={msg => setNewMessage(msg)}
          value={newMessage} // Bind the input value to the state
          blurOnSubmit={true}
          onSubmitEditing={() => send()}
          placeholder="Type a message"
          returnKeyType="send"
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  keyboard: {
    flex: 1,
    justifyContent: 'center',
  },
  image: {
    width,
    height,
  },
  header: {
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#075e54',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  right: {
    flexDirection: 'row',
  },
  chatTitle: {
    color: '#fff',
    fontWeight: '600',
    margin: 10,
    fontSize: 15,
  },
  chatImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    padding: 5,
    margin: 20,
  },
  inputText: {
    flex: 1,
    height: 30,
  },
  eachMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
  },
  rightMsg: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    margin: 5,
    alignSelf: 'flex-end',
  },
  userPic: {
    height: 40,
    width: 40,
    margin: 5,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
  },
  msgBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#ffffff',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  rightBlock: {
    width: 220,
    borderRadius: 5,
    backgroundColor: '#B8ADCC',
    padding: 10,
    shadowColor: '#3d3d3d',
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  msgTxt: {
    fontSize: 15,
    color: '#555',
    fontWeight: '600',
  },
  rightTxt: {
    fontSize: 15,
    color: '#202020',
    fontWeight: '600',
  },
})