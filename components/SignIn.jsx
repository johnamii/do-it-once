import React, { useState } from 'react';
import { StyleSheet, Button, View, Text, TextInput, Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth  } from '../firebase';

import { getUser } from './UserProvider';

function SignIn({ route, navigation, setUser }) {

  const user = getUser();
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const userSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, username, password);
    } catch(error) {
      console.log(error.message);
    }
  }

  const userSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch(error) {
      console.log(error.message);
    }
  }

  return(
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.page}>
        { user && 
        <View style={styles.formContainer}>
          <Text style={styles.userMsg}>Hi, {user.email}</Text> 
          <TouchableOpacity onPress={userSignOut} style={styles.submitButton}>
            <Text style={styles.submitButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
        }
        { !user && 
        <>
          <Text style={styles.heading}>Sign In</Text>
          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              onChangeText={(val) => setUsername(val)}
              value={username}
              placeholder="Username"
              autoCapitalize="none"              
            />
            <TextInput
              style={styles.input}
              onChangeText={(val) => setPassword(val)}
              value={password}
              placeholder="Password"
              secureTextEntry
            />
            <TouchableOpacity onPress={userSignIn} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Sign In</Text>
            </TouchableOpacity>
            <Text style={styles.label}>Create an account</Text>
            <Button title="Sign Up" onPress={() => navigation.navigate('Sign Up')}>
              <Text style={styles.alternativeButton}>Sign Up</Text>
            </Button>
          </View>
        </>
        }
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  heading: {
    fontFamily: 'PermanentMarker',
    fontSize: 25,
    marginBottom: 20
  },
  formContainer: {
    width: '75%',
    display: 'flex',
    alignItems: 'center'
  },
  label: {
    fontFamily: 'PermanentMarker',
    fontSize: 16,
    marginTop: 5,
    opacity: 0.5
  },
  input: {
    fontFamily: 'PermanentMarker',
    fontSize: 20,
    borderWidth: 2,
    borderColor: '#ddd',
    width: '100%',
    textTransform: 'lowercase',
    margin: 8,
    padding: 12,
    borderRadius: 10
  },
  submitButton: {
    backgroundColor: 'black',
    width: '100%',
    padding: 14,
    borderRadius: 20,
    marginTop: 15,
    marginBottom: 20
  },
  submitButtonText: {
    fontFamily: 'PermanentMarker',
    color: 'white',
    fontSize: 20,
    textAlign: 'center'
  },
  alternativeButton: {
    fontFamily: 'PermanentMarker',
    marginTop: 8,
  }
})


export default SignIn;