import { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Nav
import BottomNavBar from './navigation/BottomNavbar';
// Components
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import SignOut from './components/SignOut';

const RootStack = createNativeStackNavigator();

export default function App() {

  const [currentUser, setCurrentUser] = useState(null);
  let tempLoggedIn = true; // replace with user authentication logic when ready

  console.log('currentUser', currentUser?.email)

  useEffect(() => {

    onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        console.log('User signed out');
      }
    })

  }, [currentUser])

  return (
    <NavigationContainer>
        <RootStack.Navigator>
          {
            !tempLoggedIn ? (
              <>
                {/* IF NOT LOGGED IN AUTOMATICALLY, SHOW STACK */}
                <RootStack.Screen name="Sign Up" component={SignUp}/>
                <RootStack.Screen name="Sign In" component={SignIn}/>
                <RootStack.Screen name="Sign Out" component={SignOut}/>
              </>
            ) : (
              <>
                {/* OTHERWISE, SHOW BOTTOMTABNAVIGATOR AS ROOT COMPONENT FOR MAIN APP */}
                <RootStack.Screen name="Main App" component={BottomNavBar}/>
              </>
            )
          }
        </RootStack.Navigator>
    </NavigationContainer>
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
