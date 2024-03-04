// UserTile.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';
import ImgPreviewList from './ImgPreviewList'
 

const UserTile = ({ profilePicture, userName, uid, onClickPicture1, onClickPicture2 }) => {
    const [memoryData, setMemoryData] = useState([]);

  useEffect(() => {
    const fetchMemoryData = async () => {
      try {
        const db = getFirestore();
        const memoriesCollection = collection(db, 'memories');
        const querySnapshot2 = await getDocs(query(memoriesCollection, where('uid', '==', uid)));

        const memories = [];
        querySnapshot2.forEach((doc) => {
          const { uid, 'image_url': image_url } = doc.data();
          memories.push({ id: doc.id, uid, image_url });
        });

        setMemoryData(memories);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMemoryData();
  }, [uid]);
    return (
      <View style={styles.container}>
        <Image source={{ uri: profilePicture }} style={styles.profilePicture} />
        <View style={styles.userInfoContainer}>
        <Text style={styles.userName}>{userName}</Text>
        <ImgPreviewList memories={memoryData} />
        </View>
      </View>
    );
  };


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 16,
        marginTop: 20,
        padding:20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',  // Add this property
        borderWidth: 5,
        borderColor: '#000',
        borderRadius: 8,
        width: '90%',  // Add this property
        borderRadius: 5,
      },
  profilePicture: {
    width: 75,
    height: 75,
    borderRadius: 40,
    marginRight: 16,
    borderWidth: 5,
    borderColor: '#000',
    borderRadius: 100,
  },
  userInfoContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'PermanentMarker'
  },
  clickablePicturesContainer: {
    flexDirection: 'row',
    marginTop: 8,
  },
  clickablePicture: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#ddd',
  },
  pictureText: {
    marginLeft: 4,
  },
});

export default UserTile;
