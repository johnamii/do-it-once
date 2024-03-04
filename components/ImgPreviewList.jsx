import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Button } from 'react-native';

const ImgPreviewList = ({ memories }) => {
  return (
    <View style={styles.container}>
      {/* <Button title="Click Me" onPress={() => console.log('memories', memories)} /> */}
      <FlatList showsHorizontalScrollIndicator={false}
        horizontal
        data={memories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.minicontainer}>
          <Image source={{ uri: item.image_url }} style={styles.Picture} />
          </View>
        )}
      />
    </View>
  );
};

  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    },
    minicontainer: {
      borderWidth: 3,
      borderColor: '#000',
      borderRadius: 8,
      paddingHorizontal: 3,
      paddingVertical: 8,
      borderRadius: 3,
    },
    Picture: {
      width: 50, // adjust width as needed
      height: 50, // adjust height as needed
      marginHorizontal: 1, // add margin for spacing between images
      borderWidth: 2,
      borderColor: '#000',
      borderRadius: 8,
      borderRadius: 3,
    },
  });

export default ImgPreviewList;
