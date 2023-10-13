import React from 'react';
import { TextInput, View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const TextInputSignIn = ({setEmail, setPassword, showPassword, togglePasswordVisibility }) => {
  return (
    <View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholderTextColor={"black"}
          autoCapitalize="none"
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={text => setEmail(text)}
          caretHidden={false}
          caretColor="white"
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholderTextColor={"black"}
          placeholder="Password"
          secureTextEntry={!showPassword}
          underlineColorAndroid="transparent"
          onChangeText={text => setPassword(text)}
          caretHidden={false}
          caretColor="white"
        />

        <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginRight: 20 }}>
          <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#FFFFF',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  
    elevation: 5,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
};

export default TextInputSignIn;
