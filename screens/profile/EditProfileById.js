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
import { useRoute } from "@react-navigation/native";
import changeDateOfBirth from "../../handlers/changeDateOfBirth";
import { PermissionsAndroid } from "react-native";
import storage from '@react-native-firebase/storage';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileById() {
  const route = useRoute();
  const { user } = route.params;

  if (!user) {
    return <Text>User {user} not found!</Text>;
  }

  return <EditProfile user={user} />;
}

const EditProfile = ({  user  }) => {



  // Función para solicitar permisos en tiempo de ejecución.
  async function requestCameraRollPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: "Permiso de Acceso a la Galería de Fotos",
          message: "Esta aplicación necesita acceso a tu galería de fotos.",
          buttonNeutral: "Preguntar más tarde",
          buttonNegative: "Cancelar",
          buttonPositive: "OK",
        }
      );
    } catch (err) {
      console.warn(err);
    }
  }

  // Llama a la función de solicitud de permisos en algún lugar apropiado.
  useEffect(() => {
    requestCameraRollPermission();
  }, []);

  const [selectedImage, setSelectedImage] = useState(user.avatar || 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-3.jpg');
  const [avatarHasChanged, setAvatarHasChanged] = useState(false); 
  
  const [name, setName] = useState(user.name);
  const [nameHasChanged, setNameHasChanged] = useState(false);
  
  const [bio, setBio] = useState(user.bio);
  const [bioHasChanged, setBioHasChanged] = useState(false); 

  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const [dateOfBirthHasChanged, setDateOfBirthHasChanged] = useState(false); 
  
  const [lastName, setLastName] = useState(user.last_name);
  const [lastNameHasChanged, setLastNameHasChanged] = useState(false);

  
  const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY MM DD"
    );

  const [selectedStartDate, setSelectedStartDate] = useState(user.date_of_birth || startDate);
  
  const minDate = getFormatedDate(today, "YYYY MM DD");

  const handleChangeStartDate = (selected) => {
    setSelectedStartDate(selected);
    setDateOfBirthHasChanged(true);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };
  
  const handleImageSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      
      if (!result.cancelled) {
        const imageUri = result.uri;
        const fileName = 'nombre_de_tu_archivo.jpg'; // Define un nombre único para el archivo
        const storageRef = storage().ref(`ruta_en_storage/${fileName}`);
        
        // Subir la imagen a Firebase Storage
        const response = await fetch(imageUri);
        const blob = await response.blob();
        await storageRef.put(blob);
        
        // Obtener la URL de descarga de la imagen y actualizar la interfaz
        const downloadURL = await storageRef.getDownloadURL();
        setEditedImageUri(downloadURL);
        setImageHasChanged(true);
      }
    } catch (error) {
      console.error('Error al seleccionar la imagen:', error);
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
      console.log(selectedImage)
      const updated = await changeAvatar(selectedImage); 
    }
    if (dateOfBirthHasChanged) {
      const formattedDate = selectedStartDate.split('/').join(' ');
      const update = await changeDateOfBirth(formattedDate);
    }
    if (lastNameHasChanged) {
      const update = await changeLastName(lastName);
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
              margin: 20,
              backgroundColor: "#469ab6",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 20,
              padding: 35,
              width: "90%",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <DatePicker
              mode="calendar"
              maximumDate={minDate}
              minDate={today}
              selected={selectedStartDate}
              onSelectedChange={handleChangeStartDate}
              options={{
                backgroundColor: "#6B5A8E",
                textHeaderColor: "#fff",
                textDefaultColor: "#fff",
                selectedTextColor: "#fff",
                mainColor: "#6B5A8E",
                textSecondaryColor: "#fff",
                borderColor: "rgba(122,146,changes165,0.1)",
              }}
            />

            <TouchableOpacity onPress={handleOnPressStartDate}>
              <Text style={{ fontSize: 16, color: "#fff" }}>Close</Text>
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
            <Image style={styles.avatar} source={{ uri: user.avatar || 'https://icon-library.com/images/no-user-image-icon/no-user-image-icon-3.jpg'}} />
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
      height: 100,
    },
    inputLabel: {
      fontSize: 16,
    },
    textInput: {
      height: 44,
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
});
