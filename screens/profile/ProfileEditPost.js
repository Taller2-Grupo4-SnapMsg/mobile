import React, { useState } from 'react';
import { View, TextInput, Image, Text, Button, ActivityIndicator, StyleSheet, FlatList } from 'react-native';
import editPostHandler from '../../handlers/posts/editPost';
import * as ImagePicker from 'expo-image-picker';
import { Pressable } from 'react-native';
import notImage1 from '../../assets/notImage1.jpg';
import notImage2 from '../../assets/notImage2.jpeg';

const ProfileEditPost = ({ route }) => {
  const { post } = route.params;

  const [newText, setNewText] = useState(post.content);
  const [newImage, setNewImage] = useState(post.image);
  const [newHashtags, setNewHashtags] = useState(post.hashtags);

  const [isEditingText, setIsEditingText] = useState(false);
  const [isEditingImage, setIsEditingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const handleSelectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });

      if (!result.cancelled) {
        setNewImage(result.uri);
      }
    } catch (error) {
      console.error('Error seleccionando la imagen:', error);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await editPostHandler(post.id, newImage, newText, newHashtags);
      setIsEditingText(false);
      setIsEditingImage(false);
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

  const removeTag = (tagToRemove) => {
    const updatedHashtags = newHashtags.filter((tag) => tag !== tagToRemove);
    setNewHashtags(updatedHashtags);
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleSelectImage}>
        
        {newImage && <Image source={{ uri: newImage }} style={styles.image} />}
        {!newImage && (
          <Image source={{ uri: "https://us.123rf.com/450wm/surfupvector/surfupvector1908/surfupvector190802662/129243509-icono-de-l%C3%ADnea-de-arte-denegado-censura-no-hay-foto-no-hay-imagen-disponible-rechazar-o-cancelar.jpg"}} style={styles.image} />
        )}
      </Pressable>

      <TextInput
        style={styles.textInput}
        multiline
        value={newText}
        onChangeText={(text) => setNewText(text)}
      />

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

      <FlatList
        data={newHashtags}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.tag}>
            <Text style={styles.tagName}>{item}</Text>
            <Pressable onPress={() => removeTag(item)} style={styles.removeTagButton}>
              <Text style={styles.removeTagButtonText}>x</Text>
            </Pressable>
          </View>
        )}
      />

      <View style={styles.saveButtonContainer}>
        <Button title={isSaving ? 'Save...' : 'Save'} onPress={handleSave} disabled={isSaving} color="#6B5A8E" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  tagInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 8,
    marginBottom: 12,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 9,
    borderRadius: 15,
    marginVertical: 10,
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
  saveButtonContainer: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
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
});

export default ProfileEditPost;



