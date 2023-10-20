import React from 'react';
import { View, ActivityIndicator } from 'react-native';

export default function RoundSpinner() {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <View
        style={{
          width: 10,
          height: 10,
          borderRadius: 10 / 2,
          borderWidth: 4,
          borderColor: '#947EB0',
          borderStyle: 'dotted',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator size="small" color={'#947EB0'} />
      </View>
    </View>
  );
}