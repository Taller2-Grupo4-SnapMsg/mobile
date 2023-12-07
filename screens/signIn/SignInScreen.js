import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator, Modal } from 'react-native';
import small_logo from '../../assets/small_logo.png';
import LogInHandler from '../../handlers/LogInHandler';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebase';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import LoginWithGoogle from '../../handlers/LoginWithGoogle';
import SignInTextInput from '../../components/SignInTextInput';
import SignInButton from '../../components/PurpleButton';
import SignInGoogleButton from '../../components/SignInGoogleButton';
import { fetchLoggedInUser } from '../../functions/Fetchings/fetchLoggedInUser';
import { useUser } from '../../contexts/UserContext';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import LoginWithBiometrics from '../../handlers/LoginWithBiometrics';
import SignInWithBiometricsButton from '../../components/SignInWithBiometricsButton'; 
WebBrowser.maybeCompleteAuthSession();

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); 
  const { setLoggedInUser } = useUser();
  const [showSpinner, setShowSpinner] = useState(false); 

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  const handleSignIn = async () => {
    try {
      if (!email || !password) {
        Alert.alert('Alert', 'All fields are required.');
        return;
      }
      setLoading(true); 
  
      const response = await LogInHandler(email, password);
      if (response) {
        await fetchLoggedInUser({ setLoggedInUser }); 
        navigation.navigate("MainNavigator");
        navigation.reset({
          index: 0,
          routes: [{ name: "MainNavigator" }],
        });
      } else {
        setLoading(false);       }
    } catch (error) {
      setLoading(false); 
      console.error('Error in registration:', error);
    }
  };
  

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: '868247444103-oecn0irlde1gfrmc92q72fsvm867et6o.apps.googleusercontent.com',
    expoClientId: '868247444103-l4tfjj08bgitomnhm68scbg4gq1qt46v.apps.googleusercontent.com',
  });

  useEffect(() => {
    const handleGoogleSignIn = async () => {
      if (response?.type === 'success') {
        setShowSpinner(true); 

        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;
          const idToken = await user.getIdToken(true);
          const response = await LoginWithGoogle(idToken);
          if (response) {
            await fetchLoggedInUser({setLoggedInUser});
            setShowSpinner(false);
            navigation.navigate("MainNavigator");
            navigation.reset({
              index: 0,
              routes: [{ name: "MainNavigator" }],
            });
          } else {
            setShowSpinner(false); 
          }
        } catch (error) {
          setShowSpinner(false); 
          Alert.alert('Alert', 'Error signing in with Google. Please try again.');
          console.error('Google Sign-In Error:', error);
        }
      } else if (response?.type === 'error') {
        console.error('Google Sign-In Error:', response.error);
      }
    };

    handleGoogleSignIn();
  }, [response]);

  const handleSignInWithGoogle = () => {
    promptAsync();
  };

  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);

  const handleSignInWithBiometrics = async () => {
    const checkBiometricAvailability = async () => {
      const available = await LocalAuthentication.hasHardwareAsync();
      setIsBiometricAvailable(available);
    };
  
    const handleBiometricAuthentication = async () => {
      await checkBiometricAvailability(); // Wait for availability check
  
      if (isBiometricAvailable) {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: 'Autenticación biométrica requerida',
        });
  
        if (result.success) {
          const biometricToken = await SecureStore.getItemAsync('biometricToken');
          if (biometricToken) {
            const response = await LoginWithBiometrics(biometricToken);
            if (response) {
              navigation.navigate("MainNavigator");
            }
          }
        }
      }
    };
  
    await handleBiometricAuthentication();
};
  

  return (
    <ImageBackground style={styles.container}>
      <Modal transparent={true} visible={showSpinner}>
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#6B5A8E" />
        </View>
      </Modal>

      <View style={styles.logoContainer}>
        <Image style={styles.logo} source={small_logo} />
        <Text style={styles.signinTitle}>Sign in to</Text>
        <Text style={styles.signinTitleSnapMsg}>SnapMsg!</Text>
      </View>

      <View style={styles.inputsContainer}>
        <SignInTextInput setEmail={setEmail} setPassword={setPassword} showPassword={showPassword} togglePasswordVisibility={togglePasswordVisibility} />
      </View>
 
      <View style={{ marginVertical: -20 }}>
       <SignInButton onPress={handleSignIn} text="Sign in" loading={loading} />
      </View>

      <View style={{ marginTop: 30 }}>
        <SignInGoogleButton onPress={handleSignInWithGoogle} text="Sign in with Google" />
      </View>


      <View style={{ marginVertical: 0 }}>
        <SignInWithBiometricsButton onPress={handleSignInWithBiometrics} text="Sign in with Biometrics" />
      </View>

      <View style={{ marginTop: 20 }}>
        <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
          <Text style={styles.btnText}>Don't have an account? Sign up today!</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  inputsContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  signinTitleSnapMsg: {
    color: '#6B5A8E',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 40,
  },
  signinTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 30,
    marginTop: 10,
  },
  btnText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  textByRegister: {
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowRadius: 10,
  },
  logo: {
    width: 130,
    height: 130,
    top: -10,
  },
  spinnerContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)', 
    zIndex: 999, 
  },  
});

export default SignInScreen;