import Modal from 'react-native-modal';
import React, { useState, useEffect } from 'react';
import { View, Text, Image, TextInput, Pressable, SafeAreaView, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { storage } from '../../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigation } from '@react-navigation/native';
import PostHandler from '../../../handlers/posts/newPost';
import Spinner from 'react-native-loading-spinner-overlay';
import { useRoute } from '@react-navigation/native';
import ProfilePicture from '../../../components/ProfilePicture';
import { useUser } from '../../../contexts/UserContext';
import Dialog from '../../../components/Alert';
import uuid from 'uuid';
import { usePost } from '../../../contexts/PostContext';

export default function NewPost() {
  const { loggedInUser } = useUser();
  const route = useRoute();
  const { user_param } = route.params || {};
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && Object.keys(user_param).length !== 0) {
          setUser(user_param);
        } else {
          setUser(loggedInUser);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [loggedInUser, user_param]);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isLoading}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  }

  return <NewPostComponente user={user} />;
}

function NewPostComponente({ user}) {
  const navigation = useNavigation();
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [postPreview, setPostPreview] = useState('');
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [isSuccessAlertVisible, setSuccessAlertVisible] = useState(false);
  const { postsChanged, setPostsChanged } = usePost();

  const onPostPress = async () => {
    setIsLoading(true);

    if (selectedImage) {
      const fileName = 'post_image.jpg';
      const postId = uuid.v4();
      const storageRef = ref(storage, `post_images/${postId}/${fileName}`);

      const response = await fetch(selectedImage);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      const downloadURL = await getDownloadURL(storageRef);

      //const tweetText = text + (text ? '\n' : '') + `Image: ${downloadURL}`;
      //setTweetPreview(tweetText);

      setSelectedImage('');
      PostHandler(text, downloadURL);
      setSuccessAlertVisible(true);
    } else {
      setSelectedImage('');
      PostHandler(text, '');
      setSuccessAlertVisible(true);
    }
    setText('');
    setIsLoading(false);
    console.log('Post enviado')
    setPostsChanged(true);
    console.log(postsChanged)
  };

  const handlePressCancel = () => {
    navigation.navigate('InHome');
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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
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

        <View style={styles.inputContainer}>
          <ProfilePicture imageUrl={user.avatar}/>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="What's happening?"
            multiline
            numberOfLines={5}
            style={{ flex: 1 , marginLeft: '50px', paddingLeft: 10, fontSize: 18}}
          />
        </View>

        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={{ width: 100, height: 100, marginTop: 10 }}
          />
        )}

        <Text style={styles.postPreview}>{postPreview}</Text>

        <Pressable onPress={() => setImagePickerVisible(true)} style={styles.imagePicker}>
          <MaterialIcons name="add-a-photo" size={24} color="#6B5A8E" />
          <Text style={{ marginLeft: 10, color: '#6B5A8E' }}>Add Image</Text>
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

        <Dialog
          isVisible={isSuccessAlertVisible}
          message="Post generated successfully" // Puedes personalizar el mensaje aquí
          onClose={() => setSuccessAlertVisible(false)}
        />
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
  imagePicker: {
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
};
