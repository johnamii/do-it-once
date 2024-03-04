import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Ensure you have storage in your firebase exports

const AddMemoryWidget = ({ isVisible, goalText, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const fileRef = ref(storage, `memories/${new Date().toISOString()}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  };

  const addMemoryToFirestore = async () => {
    if (image) {
      const imageUrl = await uploadImage(image);
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          await addDoc(collection(db, 'memories'), {
            uid: user.uid,
            image_url: imageUrl,
            title: title || 'Goal Completed!',
            description: description,
            timestamp: serverTimestamp(),
          });
          console.log('Memory added successfully');
          onClose(); // Reset and close the modal after adding the memory
          setTitle(''); // Reset title
          setDescription(`I have completed my goal: ${goalText}`); // Reset description to initial state
          setImage(null); // Reset image
        } catch (error) {
          console.error('Error adding memory: ', error);
        }
      }
    } else {
      Alert.alert("Please select an image for the memory.");
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add this goal to your memories:</Text>

          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Title"
          />

          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            placeholder="Description"
            multiline
          />

          <Button title="Pick an image from camera roll" onPress={pickImage} />
          <Button title="Take a photo" onPress={takePhoto} />

          <TouchableOpacity style={styles.addButton} onPress={addMemoryToFirestore}>
            <Text style={styles.textStyle}>Add to Memories</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.textStyle}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#2196F3',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: 'grey',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AddMemoryWidget;
