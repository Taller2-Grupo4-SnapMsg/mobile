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
import users from "../../assets/data/users";
import { useRoute } from "@react-navigation/native";



export default function EditProfileById() {
  const route = useRoute();
  const { userId } = route.params;

  const user = users.find((u) => u.id === userId);

  if (!user) {
    return <Text>User {user} not found!</Text>;
  }

  return <EditProfile user={user} />;
}



const EditProfile = ({  user  }) => {

  
  
  const [selectedImage, setSelectedImage] = useState(user.image || " ");
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [username, setUsername] = useState(user.username);
  const [country, setCountry] = useState(user.country );
  const [bio, setBio] = useState(user.bio);
  
  const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
  const today = new Date();
  const startDate = getFormatedDate(
    today.setDate(today.getDate() + 1),
    "YYYY/MM/DD"
    );
    const [selectedStartDate, setSelectedStartDate] = useState(user.date_of_birth || startDate);
    const [startedDate, setStartedDate] = useState("12/12/2023");
    
    const minDate = getFormatedDate(today, "YYYY/MM/DD");
  const handleChangeStartDate = (propDate) => {
    setStartedDate(propDate);
  };

  const handleOnPressStartDate = () => {
    setOpenStartDatePicker(!openStartDatePicker);
  };

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

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
              selected={startedDate}
              onDateChanged={handleChangeStartDate}
              onSelectedChange={(date) => setSelectedStartDate(date)}
              format="YYYY"
              options={{
                backgroundColor: "#469ab6",
                textHeaderColor: "#fff",
                textDefaultColor: "#fff",
                selectedTextColor: "#fff",
                mainColor: "#469ab6",
                textSecondaryColor: "#fff",
                borderColor: "rgba(122,146,165,0.1)",
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
                onChangeText={(value) => setName(value)}
                editable={true}
                placeholder="Enter your name"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.textInput}>
              <TextInput
                value={email}
                onChangeText={(value) => setEmail(value)}
                editable={true}
                placeholder="Enter your email"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.textInput}>
              <TextInput
                value={username}
                onChangeText={(value) => setUsername(value)}
                editable={true}
                placeholder="Enter your username"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
          <View style={styles.textInput}>
            <TextInput
              value={bio}
              onChangeText={(value) => setBio(value)}
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
            <TextInput
              value={country}
              onChangeText={(value) => setCountry(value)}
              editable={true}
              placeholder="Enter your country"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveButton}>
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
      marginTop: 30,
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

