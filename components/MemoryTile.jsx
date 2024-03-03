import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { format } from 'date-fns';
import FlipCard from 'react-native-flip-card';

// Calculate 90% of the screen width
const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth * 0.9; // 90% of the screen width

const MemoryTile = ({ title, imageURL, description, timestamp }) => {
  const date = new Date(timestamp.seconds * 1000 + timestamp.nanoseconds / 1000000);

  return (
    <FlipCard
      style={styles.card}
      flipHorizontal={true}
      flipVertical={false}
      friction={10}
    >
      {/* Face Side */}
      <View style={styles.polaroidFront}>
        <Image source={{ uri: imageURL }} style={styles.image} />
        <View style={styles.polaroidTextContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.timestamp}>{format(date, 'PPP')}</Text>
        </View>
      </View>

      {/* Back Side */}
      <View style={styles.polaroidBack}>
        <Text style={styles.description}>{description}</Text>
      </View>
    </FlipCard>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    height: 400,
    marginBottom: 20,
    overflow: 'hidden',
  },
  polaroidFront: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    paddingBottom: 20,
    borderWidth: 5,
    borderColor: '#000',
  },
  polaroidBack: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5, 
    borderColor: '#000',
  },
  polaroidTextContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  image: {
    width: '100%',
    height: '80%',
    borderWidth: 5,
    borderColor: '#000',
    borderRadius: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default MemoryTile;
