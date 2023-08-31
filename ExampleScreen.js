import React, { useState } from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Image } from 'react-native'; // Add StyleSheet import
import logo from './our_assets/logo.png'; 

const ExampleScreen = ({ navigation }) => {
    const [pongMessage, setPongMessage] = useState('');

  const handleButtonPresss = async () => {
    try {
      const response = await fetch('https://loginback-lg51.onrender.com/ping');
      const data = await response.json();

    if (data && data.message) { //para imprimir solamente el mensaje, no el json completo (necesito conocer el formato)
      setPongMessage(data.message);
    } else {
      setPongMessage('Invalid response format');
    }
    } catch (error) {
      console.error('Error fetching data:', error);
      setPongMessage('Error fetching data from: https://loginback-lg51.onrender.com/ping');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.text}>Welcome to our app!</Text>
      <TouchableHighlight
        onPress={handleButtonPresss}
        underlayColor="#a3a5c3"
        style={styles.button}
      >
        <Text style={styles.buttonText}>Press Me</Text>
      </TouchableHighlight>
      <Text style={styles.pongMessage}>{pongMessage}</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#947eb0',
    marginTop: -30,
  },
  button: {
    backgroundColor: '#64B6AC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#DDFBD2',
    fontWeight: 'bold',
  },
  logo: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
    marginTop: -100,
  },
});

export default ExampleScreen;
