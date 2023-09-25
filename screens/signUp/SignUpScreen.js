import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert } from 'react-native';
import small_logo from '../../assets/small_logo.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RegisterHandler from '../../handlers/RegisterHandler';


const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [last_name, setLastName] = useState();
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = async () => {
    try {
      if (!email || !password || !name || !last_name || !username) {
        Alert.alert('Alert', 'All fields are required.');
        return;
      }
      await RegisterHandler(email, password, name, last_name, username)
      
      navigation.navigate('Main');
    }
    catch (error) {
      // Handle any errors thrown by RegisterHandler
      console.error('Error in registration:', error);
    }
  };
  
  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <ImageBackground
      source={{ uri: 'https://wallpaperaccess.com/full/2923163.jpg' }}
      style={styles.container}
    >
      
    <View style={styles.container}>
    <Image style={styles.logo} source={small_logo} />
    <Text style={styles.signupTitle}>Sign up to SnapMsg today!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholderTextColor={"black"}
          placeholder="First name"
          underlineColorAndroid="transparent"
          onChangeText={text => setName(text)}
        />
      </View>
        
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholderTextColor={"black"}
          placeholder="Last Name"
          underlineColorAndroid="transparent"
          onChangeText={text => setLastName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholderTextColor={"black"}
          placeholder="Username"
          underlineColorAndroid="transparent"
          onChangeText={text => setUserName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholderTextColor={"black"}
          placeholder="Email"
          keyboardType="email-address"
          underlineColorAndroid="transparent"
          onChangeText={text => setEmail(text)}
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
        />

      <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginRight: 20 }}>
        <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={25} />
      </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={[styles.buttonContainer, styles.signupButton]}
        onPress={handleSignUp}>
        <Text style={styles.signupText}>Sign up!</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleSignIn}>
        <Text style={styles.btnText}>Already have an account? Sign in</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(https://wallpaperaccess.com/full/2923163.jpg)',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#808080',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  btnByRegister: {
    height: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: 300,
    backgroundColor: 'transparent',
  },
  signupButton: {
    backgroundColor: '#6B5A8E',

    shadowColor: '#808080',
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  signupTitle: {
    color: 'white', 
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginBottom: 60,
  },
  signupText: {
    color: 'white', 
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  textByRegister: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',

    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginBottom: 10,
  }
})


export default SignUpScreen;