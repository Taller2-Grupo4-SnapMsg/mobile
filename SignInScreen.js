import React, { useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Image, TextInput, Alert } from 'react-native'; // Add StyleSheet import
import small_logo from './our_assets/small_logo.png'; 

const SignInScreen = ({ navigation }) => {
    const [username, setUsername] = useState(''); // Initialize the username state
    const [password, setPassword] = useState(''); // Initialize the password state
   
    const handleButtonSignUp = () => {
        navigation.navigate('Home');
    };

    const handleButtonSignIn = () => {
        navigation.navigate('WIP');
    };

    const handleButtonForgotPassword = () => {
        navigation.navigate('WIP');
    };

  return (
    <View style={styles.container}>
      <Image source={small_logo} style={styles.small_logo} />
      <Text style={styles.text}>Sign in</Text>
    

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.textInput}
        placeholderStyle={styles.placeholderStyle} 
        placeholderTextColor="#EDEDF4" 
      />

      <TouchableHighlight
        onPress={handleButtonForgotPassword}
        underlayColor="#45494A"
        style={styles.button}
      >
      <Text style={styles.buttonText}>Forgot our password?</Text>
      </TouchableHighlight>

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.textInput}
        secureTextEntry
        placeholderStyle={styles.placeholderStyle}
        placeholderTextColor="#EDEDF4"  
      />
      
      <TouchableHighlight
        onPress={handleButtonSignIn}
        underlayColor="#45494A"
        style={styles.button}
      >
      <Text style={styles.buttonText}>Sign in</Text>
      </TouchableHighlight>
      <Text style={styles.signUpText}>Don't have an account yet?</Text>
      
      <TouchableHighlight
        onPress={handleButtonSignUp}
        underlayColor="#45494A"
        style={styles.button}
      >
      <Text style={styles.buttonText}>Sign up!</Text>
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
    color: '#eb8258',
    marginTop: 45,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#353839',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 30,
  },
  buttonText: {
    fontSize: 20,
    color: '#ffd581',
    fontWeight: 'bold',
  },
  small_logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    marginTop: -100,
  },
  signUpText: {
    fontSize: 25,
    marginTop: 60,
    marginBottom: -10,
    color: '#eb8258',
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#EDEDF4',
    width: '80%',
    height: 60, // Adjust the height value
    marginTop: 10,
    marginBottom: 10,
    color: '#FFA500',
    fontSize: 20,
    fontStyle: 'italic',
  }
});

export default SignInScreen;
