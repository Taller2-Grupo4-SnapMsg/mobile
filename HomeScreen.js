import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Image } from 'react-native'; // Add StyleSheet import
import logo from './our_assets/logo.png'; 

const HomeScreen = ({ navigation }) => {
  const handleButtonPress = () => {
    navigation.navigate('Example');
  };
  
  const handleButtonSignInGoogle = () => {
    navigation.navigate('WIP');
  };

  const handleButtonCreateAccount = () => {
    navigation.navigate('CreateAccount');
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo}/>
      <Text style={styles.text}>Join SnapMsg today!</Text>
      
      <TouchableHighlight
        onPress={handleButtonSignInGoogle}
        underlayColor="#a3a5c3"
        style={styles.button}
      >
      <Text style={styles.buttonText}>Sign up with Google</Text>
      
      </TouchableHighlight>
      <TouchableHighlight
        onPress={handleButtonCreateAccount}
        underlayColor="#a3a5c3"
        style={styles.button}
      >
      <Text style={styles.buttonText}>Create an account</Text>

      </TouchableHighlight>
      <TouchableHighlight
        onPress={handleButtonPress}
        underlayColor="#a3a5c3"
        style={styles.button}
      >
      <Text style={styles.buttonText}>Check out an example</Text>
      </TouchableHighlight>
      
      <Text style={styles.signInText}>Already have an account?</Text>
      <TouchableHighlight
        onPress={handleButtonPress}
        underlayColor="#a3a5c3"
        style={styles.button}
      >
      <Text style={styles.buttonText}>Log in</Text>
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
    marginTop: -30,
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
  logo: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
    marginTop: -400,
  },
  signInText: {
    fontSize: 25,
    marginTop: 50,
    color: '#947eb0',
  }
});

export default HomeScreen;
