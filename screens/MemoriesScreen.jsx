import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { auth, db} from '../firebase';
import { signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import MemoryTile from '../components/MemoryTile';
import { getUser } from '../components/UserProvider';
import { useFocusEffect } from '@react-navigation/native';

function MemoriesScreen() {
  const [memories, setMemories] = useState([]);
  const user = getUser();

  useFocusEffect(() => {
    const fetchMemories = async () => {
      if (user) {
        const q = query(collection(db, "memories"), where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const fetchedMemories = [];
        querySnapshot.forEach((doc) => {
          fetchedMemories.push({ id: doc.id, ...doc.data() });
        });
        setMemories(fetchedMemories);
      }
    };

    fetchMemories();
  },);

  return (
    <View style={styles.page}>
      <View style={styles.topLine}></View>
      {user && (
        <ScrollView contentContainerStyle={styles.formContainer} showsVerticalScrollIndicator={false}>
          {memories.map((memory) => (
            <MemoryTile
              key={memory.id}
              title={memory.title}
              imageURL={memory.image_url}
              description={memory.description}
              timestamp={memory.timestamp}
            />
          ))}
        </ScrollView>
      )}
      {!user && (
        <View style={styles.formContainer}>
          <Text>User signed out successfully, consider adding redirection after the signOut function.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
  },
  formContainer: {
    paddingTop: 20,
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
  topLine: {
    width: '100%', // Make the line span the entire width of the screen
    height: 5, // Set the height of the line
    backgroundColor: 'black', // Set the color of the line
  },
});

export default MemoriesScreen;
