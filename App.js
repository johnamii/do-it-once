import { useState, useEffect, createContext, useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { UserProvider } from './components/UserProvider';

// Nav
import BottomNavBar from './navigation/BottomNavbar';
// Components
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';

const RootStack = createNativeStackNavigator();

export default function App() {

  const [user, setUser] = useState(null);

  console.log('user', user?.email)

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        console.log('User signed out');
      }
    })

  }, [user])

  return (
    <UserProvider user={user}>
      <NavigationContainer>
          <RootStack.Navigator>
            {
              !user ? (
                <>
                  {/* IF NOT LOGGED IN AUTOMATICALLY, SHOW STACK */}
                  <RootStack.Screen 
                    name="Sign Up" 
                    component={SignUp}
                    initialParams={{ user }}
                    screenOptions={{headerShown: false}}
                  />
                  <RootStack.Screen 
                    name="Sign In" 
                    component={SignIn}
                    initialParams={{ user }}
                    screenOptions={{headerShown: false}}
                  />
                  {/* <RootStack.Screen name="Sign Out" component={SignOut}/> */}
                </>
              ) : (
                <>
                  {/* OTHERWISE, SHOW BOTTOMTABNAVIGATOR AS ROOT COMPONENT FOR MAIN APP */}
                  <RootStack.Screen 
                    name="Main App" 
                    component={BottomNavBar} 
                    screenOptions={{headerShown: false, user: user}}
                  />
                </>
              )
            }
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
