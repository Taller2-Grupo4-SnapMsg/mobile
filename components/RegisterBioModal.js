import React from 'react';
import { Modal, View, Text, StyleSheet, Alert } from 'react-native';
import PurpleButton from './PurpleButton';
import RegisterBiometrics from '../handlers/RegisterBiometrics';
import { useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';

export default function RegisterBioModal({ isVisible, setModalVisible, navigation }) {
  const [loadingYes, setLoadingYes] = useState(false);
  const [loadingNo, setLoadingNo] = useState(false);
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(true);



  const handleBiometricsRegister = async () => {
    const checkBiometricAvailability = async () => {
      const available = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricAvailable(available);
    };
  
    const handleBiometricAuthentication = async () => {
      await checkBiometricAvailability();
      await checkBiometricAvailability();
      if (isBiometricAvailable) {
          const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Autenticación biométrica requerida',
          });
          if (result.success) {
            const biometricToken = await RegisterBiometrics();
            await SecureStore.setItemAsync('biometricToken', biometricToken);
            setLoadingYes(false);
            setModalVisible(false);
            navigation.navigate('Interests');      
          } else {
            console.log('Autenticación fallida');
            setLoadingYes(false);
          } 
        } else {
          Alert.alert('Alert', 'Biometric authentication is not available on this device.');
          setLoadingYes(false);
        }
      }  
    await handleBiometricAuthentication();
};



  const onClose = () => {
    setLoadingNo(true);
    setModalVisible(false);
    navigation.navigate('Interests');
  }

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={{ textAlign: 'center' }}>Want to save your fingerprint for future logins?</Text>
          <View style={styles.buttonContainer}>
            <PurpleButton onPress={onClose} text="No" loading={loadingNo} />
            <PurpleButton onPress={handleBiometricsRegister} text="Yes" loading={loadingYes} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    height: '20%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: -110,
    right: -35,
  },
});