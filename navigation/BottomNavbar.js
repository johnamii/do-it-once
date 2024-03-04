import { BottomTabBar, createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import { getUser } from '../components/UserProvider';

import MemoriesScreen from '../screens/MemoriesScreen';
import Bucket from '../screens/Buckets';

function TempScreen({route, navigation}) {
  const user = getUser();
  return (
    <View>
      <Text>{user?.email}</Text>
    </View>
  );
}

const commonHeaderStyle = {
  borderBottomWidth: 1, // Add a solid outline to the bottom of the top navbar
  borderBottomColor: 'black', // Set the color of the outline
};

const BucketStack = createNativeStackNavigator();
function BucketStackScreen({route, navigation}) {
  return (
    <BucketStack.Navigator screenOptions={{headerShown: false, headerStyle: commonHeaderStyle}}>
      <BucketStack.Screen name="Bucket" component={Bucket}/>
    </BucketStack.Navigator>
  );
}

const MemoriesStack = createNativeStackNavigator();
function MemoriesStackScreen(route, navigation) {
  return (
    <MemoriesStack.Navigator screenOptions={{headerShown: false, headerStyle: commonHeaderStyle}}>
      <MemoriesStack.Screen name="MemoriesScreen" component={MemoriesScreen}/>
    </MemoriesStack.Navigator>
  );
}

const FriendsStack = createNativeStackNavigator();
function FriendsStackScreen(route, navigation) {
  return (
    <FriendsStack.Navigator screenOptions={{headerShown: false, headerStyle: commonHeaderStyle}}>
      <FriendsStack.Screen name="Temp" component={TempScreen}/>
    </FriendsStack.Navigator>
  );
}
  
const Tab = createBottomTabNavigator();
export default function BottomNavBar({ route, navigation }) {
  const user = getUser();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false, // This hides the label
        tabBarStyle: {
          borderTopWidth: 5, // Add a solid outline to the top of the bottom navbar
          borderTopColor: 'black', // Set the color of the outline
          paddingTop: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Bucket') {
            iconName = 'ios-list';
          } else if (route.name === 'Memories') {
            iconName = 'ios-images-outline';
          } else if (route.name === 'Friends') {
            iconName = 'ios-people-outline';
          }

          // Adjust color and size for focused state
          color = focused ? 'black' : color;
          size = focused ? size * 1.2 : size; // Slightly increase the size for a "bold" effect

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Bucket" component={BucketStackScreen}/>
      <Tab.Screen name="Memories" component={MemoriesStackScreen}/>
      <Tab.Screen name="Friends" component={FriendsStackScreen}/>
    </Tab.Navigator>
  );
}
