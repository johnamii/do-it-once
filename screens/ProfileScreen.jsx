import { Image, Button, StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { auth, db} from '../firebase';
import { signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { getUser } from '../components/UserProvider';
import firebase from 'firebase/app';



const updateUserProfile = async (newDisplayName, newEmail, newPhotoURL) => {
    const user = firebase.auth().currentUser;
  
    if (user) {
      try {
        await user.updateProfile({
          displayName: newDisplayName,
          email: newEmail,
          photoURL: newPhotoURL
        });
        console.log('User profile updated!');
      } catch (error) {
        console.error('Error updating user profile:', error);
      }
    } else {
      console.log('No user is signed in.');
    }
};


export default function ProfileScreen({route, navigation}) {

    const user = getUser();

    const userSignOut = async () => {
        try {
          navigation.navigate("RootStack", {screen: 'Sign In'});
          await signOut(auth);
          
        } catch(error) {
          console.log(error.message);
        }
    }

    const [name, setName] = useState(user?.name ?? "User");
    const [email, setEmail] = useState(user.email);
    const [photoURL, setPhotoURL] = useState(user.photoURL ?? require('../assets/default_user_profile.png'))

    // Inside your component
    const changeImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result)
    
        if (!result.cancelled) {
            setPhotoURL(result.uri);
            console.log(photoURL)
        }
    };

    return (
        <View style={styles.body}>
            <View style={styles.imageCircle}>
                <Image 
                  style={styles.image} 
                  source={require('../assets/default_user_profile.png')}
                  onPress={changeImage}
                />
                {/* <TouchableOpacity title="Update" style={styles.updateImageButton} onPress={changeImage}>
                    <Text style={{color:'white', textAlign: 'center'}}>Update</Text>
                </TouchableOpacity> */}
            </View>
            
            <Text style={styles.bubbleHeader}>User Name</Text>
            <View style={styles.bubble}>
                <TextInput value={name} onChangeText={(val) => {setName(val)}}/>
            </View>
            <Text style={styles.bubbleHeader}>User Email</Text>
            <View style={styles.bubble}>
                <TextInput value={email} onChangeText={(val) => {setEmail(val)}}/>
            </View>
            <Button title="Submit" style={styles.submitButton} onPress={() => {updateUserProfile(name, email, photoURL)}}>
                <Text style={{color:'black', textAlign: 'center'}}>Submit</Text>
            </Button>
            <TouchableOpacity title="Go Back" style={styles.backButton} onPress={() => {navigation.goBack()}}>
                <Text style={{color:'white', textAlign: 'center'}}>Go Back</Text>
            </TouchableOpacity>
            <TouchableOpacity title="Sign Out" style={styles.backButton} onPress={userSignOut}>
                <Text style={{color:'white', textAlign: 'center'}}>Sign Out</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    body: {
        padding: 40,
        gap:10,
        width: '100%',
        height: '100%',
        display:'flex',
        flexDirection:'column',
        justifyContent:'between',
        alignItems:'center'
    },
    imageCircle: {
        borderColor:'black',
        borderWidth: 4,
        borderRadius: '100',
        height: 200,
        width: 200,
        overflow:'hidden',
        display:'flex',
        position: 'relative'
    },
    image: {
        width: '100%',
        height:'100%'
    },
    bubbleHeader: {
        fontSize: 18,
        fontWeight:'bold'
    },
    bubble: {
        padding: 10,
        width: '66%',
        fontSize: 16,
        backgroundColor:'#ddd',
        borderRadius: 20
    },
    updateImageButton: {
        position: 'absolute',
        bottom: 12,
        left: '25%',
        backgroundColor: 'black',
        color:'white',

        padding: 5,
        borderRadius: 20
    },
    submitButton: {
        borderwidth: 4,  
        borderStyle:'solid',
        borderColor: 'black',
        width: '33%',
        padding:10,
        borderRadius: 20
    },
    backButton: {
        backgroundColor: 'black',
        color:'white',
        width: '33%',
        padding:10,
        borderRadius: 20
    },
})