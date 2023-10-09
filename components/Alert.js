import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Dialog, { DialogContent } from 'react-native-popup-dialog';

const CustomAlert = ({ isVisible, message, onClose }) => {
  return (
    <Dialog
      visible={isVisible}
      onTouchOutside={onClose}
      dialogStyle={{
        borderWidth: 2,
        borderColor: '#6B5A8E',
        borderRadius: 10,
        margin: 0 ,
      }}
    >
      <DialogContent style={{ padding: 20 }}>
        <Text style={{ color: '#333', fontSize: 16 }}>{message}</Text>
        <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
          <Text style={{ color: '#6B5A8E', fontSize: 18, marginLeft: '75%' }}>OK</Text>
        </TouchableOpacity>
      </DialogContent>
    </Dialog>
  );
};

export default CustomAlert;