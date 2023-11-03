import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  StyleSheet,
} from "react-native";
import ToggleSwitch from 'toggle-switch-react-native'
import DatePicker, { getFormatedDate } from "react-native-modern-datepicker";
import changeName from "../../handlers/changeName";
import changeBio from "../../handlers/changeBio";
import changeAvatar from "../../handlers/changeAvatar";
import changeLastName from "../../handlers/changeLastName";
import changeLocation from "../../handlers/changeLocation";
import { useRoute } from "@react-navigation/native";
import changeDateOfBirth from "../../handlers/changeDateOfBirth";
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import AvatarPicker from "../../components/AvatarPicker";
import EditProfileTextInputField from "../../components/EditProfileTextInputField";
import CountryPickerModalEdit from "../../components/CountryPickerModalEdit";
import { useUser } from '../../contexts/UserContext';
import getUserByToken from "../../handlers/getUserByToken";
import PurpleButton from "../../components/PurpleButton";
import changePrivacy from "../../handlers/changePrivacy";

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


  const [isSaving, setIsSaving] = useState(false); // Add isSaving state
  
  const { loggedInUser, setLoggedInUser } = useUser(); // Use the hook to access loggedInUser
  
  
  const [selectedCountryName, setSelectedCountryName] = useState(user.location);
  const [CountryNameHasChanged, setCountryNameHasChanged] = useState(false);

  const [accountIsPublic, setAccountIsPublic] = useState(user.is_public);
  const [privacyHasChanged, setPrivacyHasChanged] = useState(false);
  
  const handleCountryChange = (country) => {
    setSelectedCountryName(country.name); // Set the selected country name
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
    setIsSaving(true); 

    if (nameHasChanged) {
      await changeName(name);
    }
    if (bioHasChanged) {
      await changeBio(bio);
    }
    if (avatarHasChanged) {
      await changeAvatar(selectedImage);
    }
    if (dateOfBirthHasChanged) {
      const formattedDate = selectedStartDate.split('/').join(' ');
      await changeDateOfBirth(formattedDate);
    }
    if (lastNameHasChanged) {
      await changeLastName(lastName);
    }
    if (CountryNameHasChanged) {
      await changeLocation(selectedCountryName);
    } 
    if (privacyHasChanged) {
      await changePrivacy(accountIsPublic);
    }
  
    const fetchLoggedInUser = async () => {
      try {
        const user = await getUserByToken(); 
  
        if (user) {
          setLoggedInUser(user);
        }
      } catch (error) {
        console.error('Error fetching logged-in user:', error);
      }
    };
  
    fetchLoggedInUser();
    setIsSaving(false); 
  
    navigation.navigate('Profile');
  };

  handleSwitchingAccountStatus = async () => {
    setAccountIsPublic(!accountIsPublic);
    setPrivacyHasChanged(true);
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
              <Feather name="x" size={24} color="#6B5A8E" style={{top: -30}}/>
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
        <AvatarPicker
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage} 
          onImageSelect={handleAvatarChange}
          user={user}
        />

        </View>

        <View style={styles.inputContainer}>
            <EditProfileTextInputField
              value={name}
              onChangeText={handleNameChange}
              placeholder="Enter your first name"
            />
          </View>

          <View style={styles.inputContainer}>
            <EditProfileTextInputField
              value={lastName}
              onChangeText={handleLastNameChange}
              placeholder="Enter your last name"
            />
          </View>


          <View style={styles.inputContainer}>
            <EditProfileTextInputField
              value={bio}
              onChangeText={handleBioChange}
              placeholder="Enter your bio"
              multiline={true}
              numberOfLines={4}
            />
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

        <View style={styles.inputContainer}>
          <View style={styles.textInput}>
            <CountryPickerModalEdit
              handleCountryChange={handleCountryChange}
              selectedCountryName={selectedCountryName}/>
          </View>

        </View>
          <View style={styles.publicSwitch}>
            <ToggleSwitch
              isOn={!accountIsPublic}
              label="Private Account"
              onColor="#6B5A8E"
              offColor="#ccc"
              size="medium"
              onToggle={() => {handleSwitchingAccountStatus()}}
            />
            </View>
        <PurpleButton onPress={handleSaveButton} text="Save" loading={isSaving} />
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
    inputContainer: {
      flexDirection: "column",
      marginBottom: 6,
      height: 70,
    },
    inputLabel: {
      fontSize: 16,
    },
    textInput: {
      height: 34,
      width: "100%",
      borderColor: "#ccc",
      borderBottomWidth: 1, 
      borderRadius: 4,
      marginVertical: 6,
      justifyContent: "center",
      paddingLeft: 8,
    },    
    saveButton: {
      backgroundColor: "#6B5A8E",
      height: 44,
      borderRadius: 50,
      alignItems: "center",
      justifyContent: "center",
      width: "40%",
      alignSelf: "center",
      marginTop: 200,
    },
    saveButtonText: {
      fontSize: 20,
      color: "#fff",
    },
    bioText: {
      numberOfLines: 4,
    },
    publicSwitch: {
      alignItems: 'center',
      marginBottom: 40,
    },
});
