import React, { useState, useEffect } from 'react';
import { StyleSheet, Button, Text, View, ActivityIndicator } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';

import { UserProvider } from './components/UserProvider';

import Ionicons from '@expo/vector-icons/Ionicons';
// Nav
import BottomNavBar from './navigation/BottomNavbar';
// Components
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import ProfileScreen from './screens/ProfileScreen';

const RootStack = createNativeStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  // Load your custom font
  const [fontsLoaded] = useFonts({
    'PermanentMarker': require('./assets/fonts/PermanentMarker-Regular.ttf'), // Update the path and font name accordingly
  });

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        console.log('User signed out');
      }
    });
  }, [user]);

  // Display a loading indicator while fonts are loading
  if (!fontsLoaded) {
    return <ActivityIndicator size="large"/>;
  }

  return (
    <UserProvider user={user}>
      <NavigationContainer>
        <RootStack.Navigator>
          {!user ? (
            <>
              <RootStack.Screen
                name="Sign Up"
                component={SignUp}
                initialParams={{ user }}
                screenOptions={{ headerShown: false }}
              />
              <RootStack.Screen
                name="Sign In"
                component={SignIn}
                initialParams={{ user }}
                screenOptions={{ headerShown: false }}
              />
              
            </>
          ) : (
            <>
              <RootStack.Screen
                name="Main App"
                component={BottomNavBar}
                options={({route, navigation}) => ({
                  headerShown: true,
                  headerTitle: () => (
                    <Text style={{ fontSize: 30, fontFamily: 'PermanentMarker' }}>Do it Once.</Text>
                  ),
                  headerTitleAlign: 'center',
                  headerRight: () => (
                    <Ionicons
                      name="person-circle-outline"
                      size={28}
                      onPress={() => {navigation.navigate('Profile')}}
                    />
                  ),
                })}
              />
            </>
          )}
        </RootStack.Navigator>
      </NavigationContainer>
    </UserProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
