import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import logo from './our_assets/logo.png'; 

const App = () => {
  return (
    <View>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.text}>Welcome to our app!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    backgroundColor: '#947EB0',
  },text: {
    fontSize: 24,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    fontWeight: 'bold',
    color: '#947eb0',
    marginTop: 20,
  },
  logo: {
    width: 400,
    height: 300,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    resizeMode: 'contain',
  },
});

export default App;
