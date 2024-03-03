import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Button , KeyboardAvoidingView, Keyboard} from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc,setDoc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';

export default function Bucket() {
  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (user) {
        const unsubscribe = onSnapshot(doc(db, "goals", user.uid), (documentSnapshot) => {
          if (documentSnapshot.exists()) {
            setGoals(documentSnapshot.data().goals);
          }
          else{
            const defaultGoals = [
              { id: '1', text: 'Visit Japan', isChecked: false },
              { id: '2', text: 'Read 50 books this year', isChecked: false },
              { id: '3', text: 'Run a marathon', isChecked: false },
            ];
            setDoc(doc(db, "goals", user.uid), { goals: defaultGoals });
          }
        });
        return () => unsubscribe();
      } else {
        setGoals([]);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  const toggleGoalCheck = async (id) => {
    const updatedGoals = goals.map((goal) =>
      goal.id === id ? { ...goal, isChecked: !goal.isChecked } : goal
    );
    const user = getAuth().currentUser;
    if (user) {
      await updateDoc(doc(db, "goals", user.uid), { goals: updatedGoals });
    }
  };

  const addNewGoal = async () => {
    const newGoal = {
      id: Date.now().toString(),
      text: newGoalText,
      isChecked: false,
    };
    const updatedGoals = [...goals, newGoal];
    const user = getAuth().currentUser;
    if (user) {
      setNewGoalText(''); // Reset input field
      Keyboard.dismiss(); // Dismiss the keyboard
      setGoals(updatedGoals);
      await updateDoc(doc(db, "goals", user.uid), { goals: updatedGoals });
    }
  };

  const deleteGoal = async (id) => {
    const updatedGoals = goals.filter(goal => goal.id !== id);
    const user = getAuth().currentUser;
    if (user) {
      await updateDoc(doc(db, "goals", user.uid), { goals: updatedGoals });
      setGoals(updatedGoals); // Update local state
    }
  };

  return (
    <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
  >
    <View style={styles.container}>
      
      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.goalItem}>
            <TouchableOpacity onPress={() => toggleGoalCheck(item.id)}>
              <Ionicons name={item.isChecked ? "checkbox" : "square-outline"} size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.goalText}>{item.text}</Text>
            <TouchableOpacity onPress={() => deleteGoal(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />
      <Button title="Add Goal" onPress={addNewGoal} />
      <TextInput
        style={styles.input}
        onChangeText={setNewGoalText}
        value={newGoalText}
        placeholder="Add a new goal"
        maxLength={37}
      />
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    marginBottom: 60,
    padding: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    justifyContent: 'space-between', // Adjusted for spacing
    minWidth: 240,
  },
  goalText: {
    marginLeft: 10,
  },
});