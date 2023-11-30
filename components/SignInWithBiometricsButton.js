import React from 'react';
import { TouchableOpacity, View, Image, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons'; 


const SignInWithBiometrics = ({ onPress, text }) => {
  return (
    <TouchableOpacity style={styles.buttonContainer} onPress={onPress}>
      <View style={styles.googleSigninContent}>
        <FontAwesome5 name="fingerprint" size={24} color="black" style={styles.googleIcon} />
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

export default SignInWithBiometrics;
