import React, { useState } from 'react';
import DatePicker from 'react-native-datepicker';
import { View, Text, TouchableHighlight, StyleSheet, Image, TextInput, Alert } from 'react-native'; // Add StyleSheet import
import small_logo from './our_assets/small_logo.png'; 

const CreateAccountScreen = ({ navigation }) => {
    const [email, setEmail] = useState(''); // Initialize the email state
    const [emailValid, setEmailValid] = useState(true); // Initialize as true

    const [dob, setDoB] = useState(''); // Initialize the dob state
    const [username, setUsername] = useState(''); // Initialize the username state
    const [password, setPassword] = useState(''); // Initialize the password state

  const handleButtonCreateAccount = () => {
    const userData = `Email: ${email}\nUsername: ${username}\nPassword: ${password}`;
    Alert.alert('User Data!\n', userData, [{ text: 'OK' }]);
    navigation.navigate('WIP');
  };

  const validateEmail = (email) => {
    const isValid = email.includes('@') && email.includes(".com");
    setEmailValid(isValid);
};

  return (
    <View style={styles.container}>
      <Image source={small_logo} style={styles.small_logo} />
      <Text style={styles.text}>Sign up to SnapMsg today!</Text>
      
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
            setEmail(text);
            validateEmail(text); // Call the validation function
        }}
        placeholderTextColor="#EDEDF4" 
        style={[styles.textInput, !emailValid && styles.invalidInput]}
      />

      <TextInput
        placeholder="Date of Birth"
        value={dob}
        onChangeText={setDoB}
        style={styles.textInput}
        placeholderStyle={styles.placeholderStyle} 
        placeholderTextColor="#EDEDF4" 
      />

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.textInput}
        placeholderStyle={styles.placeholderStyle} 
        placeholderTextColor="#EDEDF4" 
      />

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
    textAlign: 'center',
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
    marginTop: -100,
  },
  signInText: {
    fontSize: 25,
    marginTop: 50,
    color: '#947eb0',
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: '#EDEDF4',
    width: '80%',
    height: 60, // Adjust the height value
    marginBottom: 20,
    color: '#947eb0',
    fontSize: 20,
    fontStyle: 'italic',
  }, 
  invalidInput: {
    borderColor: '#ad343e', // pretty red for invalid input
  }
});

export default CreateAccountScreen;
