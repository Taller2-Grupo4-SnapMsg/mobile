import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

const PurpleButton = ({ onPress, loading , text}) => {
  return (
    <TouchableOpacity style={styles.signInButton} onPress={onPress} disabled={loading}>
      {loading ? (
        <ActivityIndicator size="small" color="white" />
      ) : (
        <Text style={styles.signInButtonText}>{text}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create ({
  signInButton: {
    marginTop: 0,
    backgroundColor: "#6B5A8E",
    height: 44,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    alignSelf: "center",
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PurpleButton;
