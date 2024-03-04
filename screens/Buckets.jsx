import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, Button, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc, setDoc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';
import { Ionicons } from '@expo/vector-icons';
export {currGoal}

let currGoal = '';
export default function Bucket() {
  const [goals, setGoals] = useState([]);
  const [newGoalText, setNewGoalText] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribeAuth = onAuthStateChanged(auth, user => {
      if (user) {
        const unsubscribe = onSnapshot(doc(db, "goals", user.uid), (documentSnapshot) => {
          if (documentSnapshot.exists()) {
            setGoals(documentSnapshot.data().goals);
          } else {
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
    let goalJustCompleted = false;
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        if (!goal.isChecked) { // Goal is being marked as completed
          goalJustCompleted = true;
          currGoal = goal.text
        }
        return { ...goal, isChecked: !goal.isChecked };
      }
      return goal;
    });
    const user = getAuth().currentUser;
    if (user) {
      await updateDoc(doc(db, "goals", user.uid), { goals: updatedGoals });
    }
    if(goalJustCompleted){
      //call function that uses currGoal to build a new fun page
      console.log(currGoal);
      return null;
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
      setShowAddGoal(false); // Hide the add goal widget
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
      behavior={Platform.OS === "ios" ? 100 : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 50 : 0}
    >
      <View style={styles.container}>
        <View style={styles.topLine}></View>
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
          ListFooterComponent={(
            <TouchableOpacity style={styles.addGoalButton} onPress={() => setShowAddGoal(!showAddGoal)}>
              <Ionicons name="add-circle" size={40} color="black" />
            </TouchableOpacity>
          )}
        />
        {showAddGoal && (
          <>
          <View style={styles.overlayStyle}></View>
          <View style={styles.addGoalWidget}>
            <TextInput
              style={styles.input}
              onChangeText={setNewGoalText}
              value={newGoalText}
              placeholder="Add a new goal"
              maxLength={37}
            />
            <Button title="Add Goal" onPress={addNewGoal} />
          </View>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 60,
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
    justifyContent: 'space-between',
    minWidth: 240,
  },
  goalText: {
    marginLeft: 10,
    fontFamily: 'PermanentMarker',
  },
  addGoalButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  overlayStyle: {
    position: 'absolute',
    width: '100%',
    height: '200%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black
    zIndex: 1, // Ensure it's below the addGoalWidget but above everything else
  },

  addGoalWidget: {
    position: 'absolute',
    zIndex: 2, // Ensure it's above the overlay
    width: '80%', // Adjust size as needed
    left: '10%', // Center horizontally
    top: '30%', // Adjust vertical position as needed
    bottom: '52%',
    backgroundColor: 'white', // Or any other color
    paddingHorizontal: 12,
    padding: 5,
    borderRadius: 10, // Optional: for rounded corners
    shadowColor: '#000', // Optional: for shadow
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow effect
  },
  topLine: {
    width: '100%', // Make the line span the entire width of the screen
    height: 5, // Set the height of the line
    backgroundColor: 'black', // Set the color of the line
  },
});
