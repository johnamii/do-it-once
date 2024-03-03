import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { auth, db} from '../firebase';
import { signOut } from "firebase/auth";
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from "firebase/firestore";
import MemoryTile from '../components/MemoryTile';
import { getUser } from '../components/UserProvider';

function MemoriesScreen() {
  const [memories, setMemories] = useState([]);
  const user = getUser();

  useEffect(() => {
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
  }, [user]);

  return (
    <View style={styles.page}>
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
    paddingTop: 20,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 20,
    opacity: 0.5,
  },
  submitButton: {
    backgroundColor: 'black',
    width: '100%',
    padding: 14,
    borderRadius: 6,
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    textAlign: 'center',
  },
});

export default MemoriesScreen;
