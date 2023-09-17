import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import logo from './../our_assets/logo.png';

const WIP = ({ navigation }) => {

  return (
    <View style={styles.container}>
      <Image source={logo} style={styles.logo} />
      <Text style={styles.text}>Work in progress!</Text>
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
      marginTop: 100,
    }
  });
  
export default WIP;
