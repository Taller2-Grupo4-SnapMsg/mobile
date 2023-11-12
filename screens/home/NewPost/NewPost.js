import Modal from 'react-native-modal';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import PostHandler from '../../../handlers/posts/newPost';
import ProfilePicture from '../../../components/ProfilePicture';
import { useUser } from '../../../contexts/UserContext';
import AlertBottomBanner from "../../../components/communicating_info/AlertBottomBanner"
import SendNotification from "../../../handlers/notifications/sendNotification"

TIMEOUT_ALERT_POST = 1500

export default function NewPost() {
  const navigation = useNavigation();
  const { loggedInUser } = useUser();
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [postPreview, setPostPreview] = useState('');
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [alerMessageColor, setAlertMessageColor] = useState(true);

  const setAlert = (message, color, timeout) => {
    setAlertMessageColor(color);
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
      setAlertMessageColor(null);
    }, timeout);
  }

  const onPostPress = async () => {
    setIsLoading(true);

    if (selectedImage) {
      const timestamp = new Date().getTime();
      const uniqueFileName = `image_${timestamp}.jpg`;
      const file_route = `post_images/${loggedInUser.email}/${uniqueFileName}`
      const storageRef = ref(storage, file_route);

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      setSelectedImage('');
      await PostHandler(text, file_route, tags);
    } else {
      setSelectedImage('');
      await PostHandler(text, '', tags);
    }
    data= {
      "route": 'PostDetailed',
      "post_id": 84,
    }
    await SendNotification([], "Mention", newMessage, data)
    //setAlert("Post created successfully", SOFT_GREEN, TIMEOUT_ALERT)
    setTimeout(() => {
      navigation.navigate('Home');
    }, TIMEOUT_ALERT_POST);
    // setText('');
    // setIsLoading(false);
    // setTags([]);
  };

  const handlePressCancel = () => {
    navigation.navigate('Home');
  };

  const handleImageSelection = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setSelectedImage(result.uri);
        setImagePickerVisible(false);
      }
    } catch (error) {
      console.error('Error selecting the image:', error);
    }
  };

  const addTag = (tag) => {
    setTags([...tags, tag]);
    setTagInput('');
  };

  const removeTag = (tag) => {
    const updatedTags = tags.filter((existingTag) => existingTag !== tag);
    setTags(updatedTags);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <ProfilePicture imageUrl={loggedInUser.avatar}/>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="What's happening?"
            multiline
            numberOfLines={5}
            style={{ flex: 1 , marginLeft: 50, paddingLeft: 10, fontSize: 18}}
          />
        </View>

        {selectedImage && 
          <Image
            source={{ uri: selectedImage }}
            style={styles.imagePreview}
          />
        }

        <View style={styles.tagsContainer}>
          {tags.map((tag) => (
            <View style={styles.tag} key={tag}>
              <Text style={styles.tagName}>{tag}</Text>
              <Pressable onPress={() => removeTag(tag)} style={styles.removeTagButton}>
                <Text style={styles.removeTagButtonText}>x</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <Pressable onPress={() => setImagePickerVisible(true)} style={styles.imagePicker}>
          <MaterialIcons name="add-a-photo" size={24} color="#6B5A8E" />
          <Text style={{ marginLeft: 10, color: '#6B5A8E', }}>Add Image</Text>
        </Pressable>

        <Modal
          isVisible={isImagePickerVisible}
          onBackdropPress={() => setImagePickerVisible(false)}
        >
          <View style={styles.modalContent}>
            <Pressable onPress={handleImageSelection} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Choose from Gallery</Text>
            </Pressable>
            <Pressable onPress={() => setImagePickerVisible(false)} style={styles.modalOption}>
              <Text style={styles.modalOptionText}>Cancel</Text>
            </Pressable>
          </View>
        </Modal>

        <View style={styles.tagInputContainer}>
          <TextInput
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Add Tag"
            style={styles.tagInput}
          />
          <Pressable onPress={() => addTag(tagInput)} style={styles.addTagButton}>
            <Text style={styles.addTagButtonText}>Add</Text>
          </Pressable>
        </View>

        <View style={styles.buttonContainer}>
          <Pressable onPress={handlePressCancel} style={styles.button}>
            <Text style={styles.buttonText}>Cancel</Text>
          </Pressable>

          <Pressable onPress={onPostPress} style={styles.button}>
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Post</Text>
            )}
          </Pressable>
        </View>

        {alertMessage && (
          <AlertBottomBanner
            message={alertMessage}
            backgroundColor={alerMessageColor}
            timeout={3000}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    padding: 10,
    flex: 1,
  },
  buttonContainer: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 30,
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#6B5A8E',
    padding: 10,
    paddingHorizontal: 20,
    borderRadius: 50,
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  image: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 50,
    marginRight: 10,
  },
  imagePreview: {
    width: '100%',
    aspectRatio: 16 / 9,
    marginVertical: 10,
    borderRadius: 15,
  },
  imagePicker: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  postPreview: {
    fontSize: 16,
    marginTop: 10,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalOption: {
    marginVertical: 10,
  },
  modalOptionText: {
    fontSize: 18,
    color: '#6B5A8E',
  },
  tagsContainer: {
    marginTop: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 10,
  },
  tag: {
    backgroundColor: '#6B5A8E',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  tagName: {
    color: 'white',
    marginRight: 5,
  },
  removeTagButton: {
    backgroundColor: '#6B5A8E',
    borderRadius: 50,
    padding: 5,
  },
  removeTagButtonText: {
    color: 'white',
  },
  tagInputContainer: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tagInput: {
    flex: 1,
    marginLeft: 10,
    paddingLeft: 10,
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#6B5A8E',
    borderRadius: 20,
    paddingVertical: 5,
  },
  addTagButton: {
    margin: 10,
    backgroundColor: '#6B5A8E',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  addTagButtonText: {
    color: 'white',
  },
};

