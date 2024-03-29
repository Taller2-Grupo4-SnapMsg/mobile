import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image, ImageBackground, Alert, Modal, ActivityIndicator, ScrollView } from 'react-native';
import DatePicker from 'react-native-modern-datepicker';
import { fetchLoggedInUser } from '../../functions/Fetchings/fetchLoggedInUser';
import small_logo from '../../assets/small_logo.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RegisterHandler from '../../handlers/RegisterHandler';
import SignUpButton from '../../components/PurpleButton';
import CountryPickerModal from '../../components/CountryPickerModal';
import changeLocation from '../../handlers/changeLocation';
import changeAvatar from '../../handlers/changeAvatar';
import { storage } from '../../firebase';
import { ref, getDownloadURL } from "firebase/storage";
import { useUser } from '../../contexts/UserContext';
import RegisterBioModal from '../../components/RegisterBioModal';
const SignUpScreen = ({ navigation }) => {
  const [name, setName] = useState();
  const [last_name, setLastName] = useState();
  const [username, setUserName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {setLoggedInUser}= useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [date_of_birth, setDateOfBirth] = useState('');
  const handleDateChange = (date) => {
    setDateOfBirth(date);
    setModalVisible(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const [selectedCountryName, setSelectedCountryName] = useState('Argentina');
  const [CountryNameHasChanged, setCountryNameHasChanged] = useState(false);
  
  const handleCountryChange = (country) => {
    setSelectedCountryName(country.name); 
    setCountryNameHasChanged(true);
  };
  const [modalVisibleBio, setModalVisibleBio] = useState(false);

  const handleSignUp = async () => {
    try {
      if (!email || !password || !name || !last_name || !username) {
        Alert.alert('Alert', 'All fields are required.');
        return;
      }
      setIsLoading(true);

      response = await RegisterHandler(email, password, name, last_name, username, date_of_birth)
      if (response) {
        await changeLocation(selectedCountryName);
        const storageRef = ref(
          storage,
          `/profile_pictures/default/default.png`
        );
        const downloadURL = await getDownloadURL(storageRef);
        await changeAvatar(downloadURL);
        await fetchLoggedInUser({ setLoggedInUser });
        setModalVisibleBio(true);
      }
      setIsLoading(false);
    }
    catch (error) {
      console.error('Error in registration:', error);
    }
  };
  
  const handleSignIn = () => {
    navigation.navigate('SignIn');
  };


  return (
    <ImageBackground
      style={styles.container}
    >
     <ScrollView
      contentContainerStyle={styles.scrollContainer}
      keyboardShouldPersistTaps="handled"
    >
    <View style={styles.container}>
    <Image style={styles.logo} source={small_logo} />
    <Text style={styles.signupTitle}>Sign up to <Text style={{color: '#6B5A8E', fontSize: 30}}>SnapMsg</Text> today!</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="First name"
          underlineColorAndroid="transparent"
          onChangeText={text => setName(text)}
        />
      </View>
        
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Last Name"
          underlineColorAndroid="transparent"
          onChangeText={text => setLastName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.inputs}
          placeholder="Username"
          underlineColorAndroid="transparent"
          onChangeText={text => setUserName(text)}
        />
      </View>

      <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputs}
        placeholder="Date of Birth"
        underlineColorAndroid="transparent"
        value={date_of_birth}
        onFocus={() => setModalVisible(true)}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <DatePicker
            mode="calendar"
            onDateChange={handleDateChange}
            options={{
              backgroundColor: '#090C08',
              textHeaderColor: '#947EB0',
              textDefaultColor: '#EDEDF4',
              selectedTextColor: '#fff',
              mainColor: '#947EB0',
              textSecondaryColor: '#EDEDF4',
              borderColor: 'rgba(122, 146, 165, 0.1)',
            }}
            current="1998-01-01"
            selected="1998-01-01" 
            style={{ borderRadius: 10 }}
          />
          <TouchableOpacity
            style={[styles.buttonContainer, styles.signupButton]}
             onPress={() => setModalVisible(false) }>
              <Text style={styles.signupText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>

    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputs}
        autoCapitalize="none"
        placeholder="Email"
        keyboardType="email-address"
        underlineColorAndroid="transparent"
        onChangeText={text => setEmail(text)}
      />
    </View>

    <View style={styles.inputContainer}>
      <TextInput
        style={styles.inputs}
        placeholder="Password"
        secureTextEntry={!showPassword}
        underlineColorAndroid="transparent"
        onChangeText={text => setPassword(text)}
      />

      <TouchableOpacity onPress={togglePasswordVisibility} style={{ marginRight: 20 }}>
        <Icon name={showPassword ? 'visibility-off' : 'visibility'} size={25} />
      </TouchableOpacity>

      </View>


      <View style={styles.inputContainer}>
          <View style={styles.textInput}>
            <CountryPickerModal
              handleCountryChange={handleCountryChange}
              selectedCountryName={selectedCountryName}/>
          </View>
        </View>


      <SignUpButton onPress={handleSignUp} text="Sign Up!" loading={isLoading} />

      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleSignIn}>
        <Text style={styles.btnText}>Already have an account? Sign in</Text>
      </TouchableOpacity>

      <RegisterBioModal isVisible={modalVisibleBio} setModalVisible={setModalVisibleBio} navigation={navigation} />

    </View>
    </ScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundImage: 'url(https://wallpaperaccess.com/full/2923163.jpg)',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',


    elevation: 5
  },
  signupButtonContainer: {
    backgroundColor: '#6B5A8E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50, // Add rounded corners
    paddingHorizontal: 50,
    paddingVertical: 10,
    marginVertical: 20,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
    backgroundColor: 'transparent',
  },
  btnByRegister: {
    height: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    width: 300,
    backgroundColor: 'transparent',
  },
  signupButton: {
    backgroundColor: '#6B5A8E',
    marginTop: 20,
  },
  signupTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 26,
    marginBottom: 30,

  },
  signupText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnText: {
    fontWeight: 'bold',
    marginTop: 20,
  },
  textByRegister: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 20,
    marginTop: 40,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  modalContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    elevation: 5,
  },
})


export default SignUpScreen;