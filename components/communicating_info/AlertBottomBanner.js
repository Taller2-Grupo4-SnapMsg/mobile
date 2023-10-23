import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

const AlertBottomBanner = ({ message, backgroundColor, timeout }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      // Auto-hide after timeout seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, timeout);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: backgroundColor,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingVertical: 10,
      paddingHorizontal: 20,
    },
    text: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  
  return (
    isVisible && (
      <View style={styles.container}>
        <Text style={styles.text}>{message}</Text>
      </View>
    )
  );
};

export default AlertBottomBanner;
