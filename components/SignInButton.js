import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';

const SignInButton = ({ onPress, text }) => {
  return (
    <View style={styles.buttonContainer}>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#6B5A8E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // Add rounded corners
    paddingHorizontal: 50,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SignInButton;
