import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import { getUser } from '../components/UserProvider';

// IMPORT SCREENS AND PUT IN RESPECTIVE STACK AS SOURCE COMPONENT

function TempScreen ({route, navigation}) {
    const user = getUser();
    return (
      <View>
        <Text>{user?.email}</Text>
      </View>
    )
}

const BucketStack = createNativeStackNavigator();
function BucketStackScreen ({route, navigation}) {

    //const { user } = route.params;
    
    return (
        <BucketStack.Navigator screenOptions={{headerShown: false}}>
            <BucketStack.Screen name="Temp" component={TempScreen}/>
        </BucketStack.Navigator>
    )
}

const MemoriesStack = createNativeStackNavigator();
function MemoriesStackScreen (route, navigation) {

    return (
        <MemoriesStack.Navigator screenOptions={{headerShown: false}}>
            <MemoriesStack.Screen name="Temp" component={TempScreen}/>
        </MemoriesStack.Navigator>
    )
}

const FriendsStack = createNativeStackNavigator();
function FriendsStackScreen (route, navigation) {

    return (
        <FriendsStack.Navigator screenOptions={{headerShown: false}}>
            <FriendsStack.Screen name="Temp" component={TempScreen}/>
        </FriendsStack.Navigator>
    )
}
  
const Tab = createBottomTabNavigator();
export default function BottomNavBar({ route, navigation }) {

    const user = getUser();

    return (
      <Tab.Navigator screenOptions={{headerShown: false}}>
        
        <Tab.Screen name="Bucket" component={BucketStackScreen}/>
        <Tab.Screen name="Memories" component={MemoriesStackScreen}/>
        <Tab.Screen name="Friends" component={FriendsStackScreen}/>
      </Tab.Navigator>
    );
}