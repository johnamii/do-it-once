import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Alert, Image, Dimensions, ActionSheetIOS } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase'; // Ensure you have storage in your firebase exports
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo

const screenWidth = Dimensions.get('window').width;
const fieldWidth = screenWidth * 0.8; // 80% of the screen width

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

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri); // Accessing the selected image through the assets array
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("You've refused to allow this app to access your camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync();

    if (!result.canceled && result.assets) {
      setImage(result.assets[0].uri); // Accessing the captured image through the assets array
    }
  };

  const showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['Cancel', 'Pick from Camera Roll', 'Take a Photo'],
        cancelButtonIndex: 0,
      },
      async (buttonIndex) => {
        if (buttonIndex === 1) {
          await pickImage();
        } else if (buttonIndex === 2) {
          await takePhoto();
        }
      }
    );
  };

  const uploadImage = async (uri) => {
    try {
      const response = await fetch(uri);
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      const blob = await response.blob();
      const fileRef = ref(storage, `memories/${new Date().toISOString()}`);
      await uploadBytes(fileRef, blob);
      return await getDownloadURL(fileRef);
    } catch (error) {
      console.error('Error uploading image: ', error);
      throw error; // Re-throw the error to propagate it to the caller
    }
  };

  const addMemoryToFirestore = async () => {
    if (image) {
      try {
        const imageUrl = await uploadImage(image);
        const auth = getAuth();
        const user = auth.currentUser;
        if (user) {
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
          setDescription(''); // Reset description
          setImage(null); // Reset image
        }
      } catch (error) {
        console.error('Error adding memory: ', error);
        Alert.alert("Error", "Failed to add memory. Please try again later.");
      }
    } else {
      Alert.alert("Please select an image for the memory.");
    }
  };
  

  const handleClose = () => {
    setImage(null); // Reset image when the close button is clicked
    onClose(); // Close the modal
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
          <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <Text style={styles.modalText}>New Memory</Text>

          {image ? (
            <Image source={{ uri: image }} style={styles.imagePreview} />
          ) : (
            <TouchableOpacity style={styles.imagePlaceholder} onPress={showActionSheet}>
              <Text style={styles.placeholderText}>Tap here to add an image</Text>
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Title"
          />

          <TextInput
            style={styles.descriptionInput}
            onChangeText={setDescription}
            value={description}
            placeholder="Description"
            multiline
          />

          <TouchableOpacity style={styles.addButton} onPress={addMemoryToFirestore}>
            <Text style={styles.textStyle}>Add to Memories</Text>
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
    margin: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
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
    fontFamily: 'PermanentMarker',
    fontSize: 25,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    fontFamily: 'PermanentMarker',
    width: fieldWidth,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  descriptionInput: {
    fontFamily: 'PermanentMarker',
    width: fieldWidth,
    height: 100,
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 5,
  },
  addButton: {
    width: '100%',
    backgroundColor: 'black',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  textStyle: {
    fontFamily: 'PermanentMarker',
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  imagePreview: {
    width: 250,
    height: 250,
    marginBottom: 10,
    borderRadius: 8,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
    height: 250,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    marginBottom: 10,
  },
  placeholderText: {
    fontFamily: 'PermanentMarker',
    fontSize: 16,
    color: '#666666',
  },
});

export default AddMemoryWidget;
