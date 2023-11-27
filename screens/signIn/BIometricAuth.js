import React, { useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';

const BiometricAuth = ({ onAuthentication }) =>  {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    const available = await LocalAuthentication.hasHardwareAsync();
    setIsBiometricAvailable(available);
  };

  const handleBiometricAuthentication = async () => {
    if (isBiometricAvailable) {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autenticación biométrica requerida',
      });

      if (result.success) {
        // La autenticación biométrica fue exitosa
        console.log('Autenticación exitosa');
        // Aquí puedes acceder al token encriptado y enviarlo al servidor
      } else {
        // La autenticación biométrica falló o fue cancelada
        console.log('Autenticación fallida');
      }
    } else {
      // Dispositivo sin soporte para autenticación biométrica
      console.log('Autenticación biométrica no disponible en este dispositivo');
    }
  };

  return (
    <View>
      <Text>¡Bienvenido!</Text>
      {isBiometricAvailable && (
        <Button title="Autenticar con Biometría" onPress={handleBiometricAuthentication} />
      )}
    </View>
  );
};

export default BiometricAuth;
