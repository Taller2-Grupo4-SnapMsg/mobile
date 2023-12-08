import React, { useState, useEffect } from 'react';
import { View, TextInput, Image, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import editPostHandler from '../../handlers/posts/editPost';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../contexts/UserContext';
import MentionModal from '../../components/MentionModal';
import { MaterialIcons } from '@expo/vector-icons';

TIMEOUT_ALERT_EDIT = 1500
DEFAULT_IMAGE = "https://us.123rf.com/450wm/surfupvector/surfupvector1908/surfupvector190802662/129243509-icono-de-l%C3%ADnea-de-arte-denegado-censura-no-hay-foto-no-hay-imagen-disponible-rechazar-o-cancelar.jpg"

const ProfileEditPost = ({ route }) => {
  const navigation = useNavigation();
  const { loggedInUser } = useUser();
  const { post } = route.params;

  const [newText, setNewText] = useState(post.text);
  const [newImage, setNewImage] = useState(null);
  const [newHashtags, setNewHashtags] = useState(post.hashtags);
  const [newMentions, setNewMentions] = useState(post.mentions);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [mentionInput, setMentionInput] = useState('');
  const [changeImage, setChangeImage] = useState(false);
  const [mentionsModalVisible, setMentionsModalVisible] = useState(false);

  const handleMentionModal = () => {
    setMentionsModalVisible(!mentionsModalVisible);
  }

  const handleSelectImage = async () => {

  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage(result.assets[0].uri);
      setChangeImage(true);
    } 
  } catch (error) {
    console.error('Error seleccionando la imagen:', error);
  }
};
  

  const handleSave = async () => {
    setIsSaving(true);
    try {
      if (post.image) {
        if (changeImage) {
          const storageRef = ref(storage, decodeURIComponent(post.image));
          const response = await fetch(newImage);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob);
        }
        await editPostHandler(post.post_id, decodeURIComponent(post.image), newText, newHashtags, newMentions, navigation);
      } else {
        file_route = '';
        if (changeImage) {
          const timestamp = new Date().getTime();
          const uniqueFileName = `image_${timestamp}.jpg`;
          const storageRef = ref(storage, file_route);
          file_route = `post_images/${loggedInUser.email}/${uniqueFileName}`
          
          const response = await fetch(newImage);
          const blob = await response.blob();
          await uploadBytes(storageRef, blob);
        }
        await editPostHandler(post.post_id, file_route, newText, newHashtags, newMentions, navigation);
      } 
      navigation.navigate('Profile');
      Alert.alert('Alert', 'Post edited successfully');
    } catch (error) {
      console.error('Error al guardar el post:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const addTag = () => {
    if (tagInput.trim() !== '') {
      setNewHashtags([...newHashtags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const addMention = () => {
    if (mentionInput.trim() !== '') {
      setNewMentions([...newMentions, mentionInput.trim()]);
      setMentionInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    const updatedHashtags = newHashtags.filter((tag) => tag !== tagToRemove);
    setNewHashtags(updatedHashtags);
  };

  const removeMention = (mentionToRemove) => {
    const updatedMentions = newMentions.filter((mention) => mention !== mentionToRemove);
    setNewMentions(updatedMentions);
  };

const fetchImageURL = async () => {
  try {
    if (!post.image) {
      return;
    }
    const decoded_file_route = decodeURIComponent(post.image);
    const storageRef = ref(storage, decoded_file_route);
    const url = await getDownloadURL(storageRef);
    setNewImage(url);
  } catch (error) {
    console.error('Error fetching image URL:', error);
  }
};

// Call the function when the component mounts
useEffect(() => {
  fetchImageURL();
}, []);


  return (
    <ScrollView style={styles.container}>
    <View style={styles.container}>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.sectionLabel}>Image Post</Text>
      </View>
      <View>
        <Pressable onPress={handleSelectImage}>
          <AntDesign name="edit" size={35} color="black" style={styles.editIcon} />
          <View style={styles.imageContainer}>
            {newImage && (
              <Image source={{ uri: newImage}} style={styles.image} />
            )}
            {!newImage && (
              <Image source={{ uri: DEFAULT_IMAGE}} style={styles.image} />
            )}
          </View>
        </Pressable>
      </View>

        <Text style={styles.sectionLabel}>Content Post</Text>
        <TextInput
          style={styles.textInput}
          multiline
          value={newText}
          onChangeText={(text) => setNewText(text)}
        />

        <Text style={styles.sectionLabel}>Hashtags of the Post</Text>
        <View style={styles.tagsContainer}>
          {newHashtags.map((tag) => (
            <View style={styles.tag} key={tag}>
              <Text style={styles.tagName}>{tag}</Text>
              <Pressable onPress={() => removeTag(tag)} style={styles.removeTagButton}>
                <Text style={styles.removeTagButtonText}>x</Text>
              </Pressable>
            </View>
          ))}
        </View>

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

        <Text style={styles.sectionLabel}>Mentions of the Post</Text>

        <View style={styles.tagsContainer}>
          <View style={styles.tagsContainer}>
            {newMentions.map((mention) => (
              <View style={styles.tag} key={mention}>
                <Text style={styles.tagName}>@{mention}</Text>
                <Pressable onPress={() => removeMention(mention)} style={styles.removeTagButton}>
                  <Text style={styles.removeTagButtonText}>x</Text>
                </Pressable>
              </View>
            ))}
          </View>

          <Pressable onPress={handleMentionModal} style={styles.imagePicker}>
              <MaterialIcons name="alternate-email" size={24} color="#6B5A8E" />
              <Text style={{ marginLeft: 5, marginRight: 15,color: '#6B5A8E', }}>Add mention</Text>
          </Pressable>
        </View>

        <MentionModal
            isVisible={mentionsModalVisible}
            onClose={handleMentionModal}
            selectedMentions={newMentions}
            setSelectedMentions={setNewMentions}
            in_followers={true}
            onlyUsernames={true}
          />


      <View style={styles.saveButtonContainer}>
        <Button title={isSaving ? 'Save...' : 'Save'} onPress={handleSave} disabled={isSaving} color="#6B5A8E"/>
      </View>
    </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  imageContainer: {
    position: "relative",
  },
  sectionLabel: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    marginTop: 10,
  }, 
  container_edit: {
    flexDirection: 'row',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 9,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 4,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 15,
    marginVertical: 7,
  },
  tagsContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
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
  imagePicker: {
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tagInputContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  saveButtonContainer: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 10,
    paddingBottom: 20,
  }
});

export default ProfileEditPost;



