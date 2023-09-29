import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Modal,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons } from "@expo/vector-icons";
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import changeName from "../../handlers/changeName";
import changeBio from "../../handlers/changeBio";
import changeAvatar from "../../handlers/changeAvatar";
import changeLastName from "../../handlers/changeLastName";
import changeCountry from "../../handlers/changeCountry";
import { useRoute } from "@react-navigation/native";
import changeDateOfBirth from "../../handlers/changeDateOfBirth";
import { useNavigation } from '@react-navigation/native';
import  { storage }  from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; 
import { Feather } from '@expo/vector-icons';
import CountryPicker from 'react-native-country-picker-modal'



export default function EditProfileById() {
  const route = useRoute();
  const { user } = route.params;

  if (!user) {
    return <Text>User {user} not found!</Text>;
  }

  return <EditProfile user={user} />;
}

const EditProfile = ({  user  }) => {

  const [selectedImage, setSelectedImage] = useState(user.avatar);
  const [avatarHasChanged, setAvatarHasChanged] = useState(false); 
  
  const [name, setName] = useState(user.name);
  const [nameHasChanged, setNameHasChanged] = useState(false);
  
  const [bio, setBio] = useState(user.bio);
  const [bioHasChanged, setBioHasChanged] = useState(false); 

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [dateOfBirthHasChanged, setDateOfBirthHasChanged] = useState(false); 
  
  const [lastName, setLastName] = useState(user.last_name);
  const [lastNameHasChanged, setLastNameHasChanged] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState({
    code: 'US', // Set the default country code
    name: 'United States', // Set the default country name
  });

  const [selectedCountryName, setSelectedCountryName] = useState("Select a country");
  const [CountryNameHasChanged, setCountryNameHasChanged] = useState(false);

  const [selectedCountryCode, setSelectedCountryCode] = useState(''); // Initialize it with an empty string

  
  const handleCountryChange = (country) => {
    setSelectedCountry(country);
    setSelectedCountryName(country.name); // Set the selected country name
    setSelectedCountryCode(country.cca2); // Set the selected country code
    setCountryNameHasChanged(true);
  };
    const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
    );

  const [selectedStartDate, setSelectedStartDate] = useState(user.date_of_birth.split(' ')[0] || startDate);
  
  const minDate = getFormatedDate(today, "YYYY/MM/DD");

  const handleChangeStartDate = (selected) => {
    setSelectedStartDate(selected);
    setDateOfBirthHasChanged(true);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };
  

  const handleImageSelection = async () => {
    try {
      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
  
      if (!result.canceled) {
        const imageUri = result.assets[0].uri;
        const fileName = 'profile_picture.jpg'; // Define a unique name for the file
        const storageRef = ref(storage, `profile_pictures/${user.email}/${fileName}`); // Use ref function
  
        // Upload the image to Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await uploadBytes(storageRef, blob); // Use uploadBytes function to upload
  
        // Get the download URL of the image and update the state variable
        const downloadURL = await getDownloadURL(storageRef);
        setSelectedImage(downloadURL); // Update the state variable here
        setAvatarHasChanged(true);
      }
    } catch (error) {
      console.error('Error selecting the image:', error);
    }
  };    
  
  const handleLastNameChange = (value) => {
    setLastName(value);
    setLastNameHasChanged(true);
  };

  const handleNameChange = (value) => {
    setName(value);
    setNameHasChanged(true);
  };

  const handleBioChange = (value) => {
    setBio(value); 
    setBioHasChanged(true); 
  }

  const handleAvatarChange = (value) => {
    setSelectedImage(value); 
    setAvatarHasChanged(true); 
  }
  
  const navigation = useNavigation();

  const handleSaveButton = async () => {
    if (nameHasChanged) {
      const updated = await changeName(name);
    }
    if (bioHasChanged) {
      const updated = await changeBio(bio); 
    }
    if (avatarHasChanged) {
      const updated = await changeAvatar(selectedImage); 
    }
    if (dateOfBirthHasChanged) {
      const formattedDate = selectedStartDate.split('/').join(' ');
      const update = await changeDateOfBirth(formattedDate);
    }
    if (lastNameHasChanged) {
      const update = await changeLastName(lastName);
    }
    if (CountryNameHasChanged) {
     // const update = await changeCountry(selectedCountryName);
    }
    navigation.goBack();
  }

  function renderDatePicker() {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={openStartDatePicker}
      >
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              padding: 35,
              width: "95%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
            }}
          >
            <DatePicker
              mode="calendar"
              maximumDate={minDate}
              minDate={today}
              selected={selectedStartDate}
              onSelectedChange={handleChangeStartDate}
              options={{
                textHeaderColor: "#fff",
                textDefaultColor: "#fff",
                mainColor: "#6B5A8E",
                textSecondaryColor: "#fff",
                borderColor: "#6B5A8E",
              }}
            />

            <TouchableOpacity onPress={handleOnPressStartDate}>
              <Feather name="x" size={24} color="#6B5A8E" />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={handleImageSelection}>
            <Image style={styles.avatar} source={{ uri: user.avatar}} />
            <Image source={{ uri: selectedImage }} style={styles.image} />
            <View style={styles.cameraIcon}>
              <MaterialIcons name="photo-camera" size={32} color={'#6B5A8E'}/>
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <View style={styles.inputContainer}>
            <View style={styles.textInput}>
              <TextInput
                value={name}
                onChangeText={handleNameChange}
                editable={true}
                placeholder="Enter your first name"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.textInput}>
              <TextInput
                value={lastName}
                onChangeText={handleLastNameChange}
                editable={true}
                placeholder="Enter your last name"
              />
            </View>
          </View>

          

          <View style={styles.inputContainer}>
          <View style={styles.textInput}>
            <TextInput
              value={bio}
              onChangeText={handleBioChange}
              editable={true}
              placeholder="Enter your bio"
              multiline={true} // Allow multiple lines
              numberOfLines={4} // Set the number of visible lines (adjust as needed)
            />
          </View>
        </View>

          <View style={styles.inputContainer}>
            <TouchableOpacity
              onPress={handleOnPressStartDate}
              style={styles.textInput}
              placeholder="Enter your date of birth"
            >
            <Text>{selectedStartDate}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.textInput}>
          <View style={styles.countryPickerContainer}>
            <CountryPicker
              {...{
                withCountryNameButton: true,
                onSelect: handleCountryChange,
                countryCode: selectedCountryCode,
                disabled: true, // Disable user interaction with the picker
              }}
            />
          </View>
          </View>
        </View>


      
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>

        {renderDatePicker()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      paddingHorizontal: 22,
    },
    header: {
      marginHorizontal: 12,
      flexDirection: "row",
      justifyContent: "center",
    },
    headerIcon: {
      position: "absolute",
      left: 0,
    },
    headerText: {
      fontSize: 18,
    },
    imageContainer: {
      alignItems: "center",
      marginVertical: 22,
    },
    image: {
      height: 170,
      width: 170,
      borderRadius: 85,
      borderWidth: 2,
      borderColor: "#6B5A8E",
    },
    cameraIcon: {
      position: "absolute",
      bottom: 0,
      right: 10,
      zIndex: 9999,
    },
    inputContainer: {
      flexDirection: "column",
      marginBottom: 6,
      height: 80,
    },
    inputLabel: {
      fontSize: 16,
    },
    textInput: {
      height: 34,
      width: "100%",
      borderColor: "#ccc",
      borderBottomWidth: 1, // Add this line
      borderRadius: 4,
      marginVertical: 6,
      justifyContent: "center",
      paddingLeft: 8,
    },    
    saveButton: {
      marginTop: 0,
      backgroundColor: "#6B5A8E",
      height: 44,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      width: "40%",
      alignSelf: "center", // Center button horizontally
    },
    saveButtonText: {
      fontSize: 20,
      color: "#fff",
    },
    bioText: {
      numberOfLines: 4,
    }
});
