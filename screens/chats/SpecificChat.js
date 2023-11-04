import React, { useState, useRef } from 'react'
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

const { width, height } = Dimensions.get('window')


export default SpecificChat = () => {
  const { loggedInUser } = useUser();
  const messagesData = [
    {
      id: 1,
      nick: "Atlas",
      sent: true,
      msg: 'Lorem ipsum dolor',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
    },
    {
      id: 2,
      nick: "Atlas",
      sent: true,
      msg: 'sit amet, consectetuer',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
    },
    {
      id: 3,
      nick: "Boras",
      sent: false,
      msg: 'adipiscing elit. Aenean ',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar6.png',
    },
    {
      id: 4,
      nick: "Atlas",
      sent: true,
      msg: 'commodo ligula eget dolor.',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
    },
    {
      id: 5,
      nick: "Boras",
      sent: false,
      msg: 'Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar6.png',
    },
    {
      id: 6,
      nick: "Atlas",
      sent: true,
      msg: 'nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec pede justo, fringilla vel, aliquet nec, vulputate eget, arcu. In enim justo',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
    },
    {
      id: 7,
      nick: "Boras",
      sent: false,
      msg: 'rhoncus ut, imperdiet',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar6.png',
    },
    {
      id: 8,
      nick: "Boras",
      sent: false,
      msg: 'a, venenatis vitae',
      image: 'https://www.bootdey.com/img/Content/avatar/avatar6.png',
    },
  ]
  const [messages, setMessages] = useState(messagesData);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef(null);


  const reply = () => {
    var messagesList = messages
    messagesList.push({
      id: Math.floor(Math.random() * 99999999999999999 + 1),
      sent: false,
      msg: newMessage,
      image: 'https://www.bootdey.com/img/Content/avatar/avatar6.png',
    })
    setNewMessage('')
    setMessages(messagesList)
    setTimeout(() => {
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd();
      }
    }, 100);
  }

  const send = () => {
    if (newMessage.length > 0) {
      let messagesList = messages
      messagesList.push({
        id: Math.floor(Math.random() * 99999999999999999 + 1),
        sent: true,
        msg: newMessage,
        image: 'https://www.bootdey.com/img/Content/avatar/avatar1.png',
      })
      setMessages(messagesList);
      Keyboard.dismiss();
      setTimeout(() => {
        reply()
      }, 2000)
      if (flatListRef.current) {
        flatListRef.current.scrollToEnd();
      }
    }
  }

  const renderItem = ({ item }) => {
    if (item.sent === false) {
      return (
        <View style={styles.eachMsg}>
          <Image source={{ uri: item.image }} style={styles.userPic} />
          <View style={styles.msgBlock}>
            <Text style={styles.msgTxt}>{item.msg}</Text>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.rightMsg}>
          <View style={styles.rightBlock}>
            <Text style={styles.rightTxt}>{item.msg}</Text>
          </View>
          <Image source={{ uri: loggedInUser.avatar }} style={styles.userPic} />
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
        keyExtractor={(item) => item.id.toString()}
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