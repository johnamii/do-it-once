import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import UserTile from '../components/UserTile';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const FriendsScreen = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const db = getFirestore();
        const usersCollection = collection(db, 'profiles');
        const querySnapshot = await getDocs(usersCollection);

        const userData = [];
        querySnapshot.forEach((doc) => {
            const { uid, 'pfp-img-url': profilePicture, 'name': userName } = doc.data();
            userData.push({ id: doc.id, uid, profilePicture, userName });            
        });

        setUsers(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchProfileData();
  }, []); // Run the effect only once on component mount

  return (
    <View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <UserTile
            key={item.id}
            profilePicture={item.profilePicture}
            userName={item.userName}
            uid={item.uid}
          />
        )}
      />
    </View>
  );
};

export default FriendsScreen;
