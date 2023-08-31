import React, { useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Image, TextInput } from 'react-native'; // Add StyleSheet import
import small_logo from './our_assets/small_logo.png'; 

const CreateAccountScreen = ({ navigation }) => {
    const [email, setEmail] = useState(''); // Initialize the email state

  const handleButtonCreateAccount = () => {
    navigation.navigate('WIP');
  };

  return (
    <View style={styles.container}>
      <Image source={small_logo} style={styles.small_logo} />
      <Text style={styles.text}>Sign up to SnapMsg today!</Text>
      
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.textInput}
      />
      
      <TouchableHighlight
        onPress={handleButtonCreateAccount}
        underlayColor="#a3a5c3"
        style={styles.button}
      >
      <Text style={styles.buttonText}>Create account!</Text>
  
      </TouchableHighlight>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#353839',
  },
  text: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#947eb0',
    marginTop: 45,
  },
  button: {
    backgroundColor: '#EDEDF4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    color: '#947EB0',
    fontWeight: 'bold',
  },
  small_logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: -450,
  },
  signInText: {
    fontSize: 25,
    marginTop: 50,
    color: '#947eb0',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#EDEDF4',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    width: '80%', // Adjust the width as needed
    marginBottom: 20,
  }
});

export default CreateAccountScreen;
