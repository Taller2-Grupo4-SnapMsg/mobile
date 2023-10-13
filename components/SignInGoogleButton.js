import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';

const GoogleSignInButton = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.googleSigninContent}>
        <Image source={require('../assets/google_icon.png')} style={styles.googleIcon} />
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 15,
    borderRadius: 30,
    marginTop: 10,
  },
  googleSigninContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GoogleSignInButton;
