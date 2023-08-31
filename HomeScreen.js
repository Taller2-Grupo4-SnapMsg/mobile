import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet, Image } from 'react-native'; // Add StyleSheet import
import logo from './our_assets/logo.png'; 

const HomeScreen = ({ navigation }) => {
  const handleButtonPress = () => {
    navigation.navigate('Example');
  };

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.text}>Welcome to our app!</Text>
      <TouchableHighlight
        onPress={handleButtonPress}
        underlayColor="#a3a5c3"
        style={styles.button}
      >
        <Text style={styles.buttonText}>Press Me</Text>
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#947eb0',
    marginTop: -30,
  },
  button: {
    backgroundColor: '#EDEDF4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#947EB0',
    fontWeight: 'bold',
  },
  logo: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
    marginTop: -100,
  },
});

export default HomeScreen;
