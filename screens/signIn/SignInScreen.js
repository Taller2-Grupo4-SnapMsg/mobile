import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, Alert, ActivityIndicator, Modal } from 'react-native';
import small_logo from '../../assets/small_logo.png';
import LogInHandler from '../../handlers/LogInHandler';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential } from 'firebase/auth';
import { auth } from '../../firebase';
import * as Google from 'expo-auth-session/providers/google';
import { useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import LoginWithGoogle from '../../handlers/LoginWithGoogle';
import SignInTextInput from '../../components/SignInTextInput';
import SignInButton from '../../components/SignInButton';
import SignInGoogleButton from '../../components/SignInGoogleButton';
import { fetchLoggedInUser } from '../../functions/Fetchings/fetchLoggedInUser';
import { useUser } from '../../UserContext';
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
        navigation.navigate('Home');
      } else {
        setLoading(false); 
        Alert.alert('Alert', 'Incorrect email or password.');
      }
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
        setShowSpinner(true); // Show the modal overlay with the spinner

        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        try {
          const userCredential = await signInWithCredential(auth, credential);
          const user = userCredential.user;
          const idToken = await user.getIdToken(true);
          const response = await LoginWithGoogle(idToken);
          if (response) {
            await fetchLoggedInUser({setLoggedInUser});
            navigation.navigate('Home');
          } else {
            setShowSpinner(false); 
            Alert.alert('Alert', 'To be able to log in with Google you must have an account. Please sign up.');
          }
        } catch (error) {
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
      <View style={styles.signInButton}>
        {loading ? ( 
          <ActivityIndicator size="small" color="#6B5A8E" />
        ) : (
          <SignInButton onPress={handleSignIn} text="Sign in" />
        )}
      </View>
      <View style={{ marginVertical: 30 }}>
        <SignInGoogleButton onPress={handleSignInWithGoogle} text="Sign in with Google" />
      </View>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleSignUp}>
        <Text style={styles.btnText}>Don't have an account? Sign up today!</Text>
      </TouchableOpacity>
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
  signInButton: {
    alignItems: 'center', // Center the button
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
    width: 150,
    height: 150,
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
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Semi-transparent black background
    zIndex: 999, // Set a high zIndex value
  },
  
});

export default SignInScreen;