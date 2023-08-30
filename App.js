import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, Text, View } from 'react-native';
import logo from './our_assets/logo.png'; 

const App = () => {
  return (
    <View style={styles.container}> 
      <Image source={logo} style={styles.logo} />
      <Text style={styles.text}>Welcome to our app!</Text>
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
  logo: {
    width: 400,
    height: 300,
    resizeMode: 'contain',
    marginTop: -100,
  },
});

export default App;
