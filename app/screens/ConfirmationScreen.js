import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { addHike } from '../database/Database';

const ConfirmationScreen = ({ navigation, route }) => {
  const { hikeData } = route.params;

  const handleConfirm = async () => {
    try {
      await addHike(hikeData);
      Alert.alert('Success', 'Hike added successfully!');
      navigation.popToTop();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to save hike.');
    }
  };

  const handleEdit = () => {
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Please review your entries:</Text>

      {hikeData.image && (
        <View style={styles.imageContainer}>
            <Text style={styles.label}>Selected Photo:</Text>
            <Image source={{ uri: hikeData.image }} style={styles.imagePreview} />
        </View>
      )}

      <Text style={styles.label}>Name:</Text>
      <Text style={styles.value}>{hikeData.name}</Text>

      <Text style={styles.label}>Location:</Text>
      <Text style={styles.value}>{hikeData.location}</Text>
      
      <Text style={styles.label}>Runner Name:</Text>
      <Text style={styles.value}>{hikeData.custom_field1 || 'N/A'}</Text>
      
      <Text style={styles.label}>Weather:</Text>
      <Text style={styles.value}>{hikeData.custom_field2 || 'N/A'}</Text>

      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>{hikeData.date}</Text>

      <Text style={styles.label}>Parking:</Text>
      <Text style={styles.value}>{hikeData.parking}</Text>

      <Text style={styles.label}>Length:</Text>
      <Text style={styles.value}>{hikeData.length} km</Text>

      <Text style={styles.label}>Difficulty:</Text>
      <Text style={styles.value}>{hikeData.difficulty}</Text>

      <Text style={styles.label}>Description:</Text>
      <Text style={styles.value}>{hikeData.description || 'N/A'}</Text>

      <View style={styles.buttonRow}>
        <Button title="Edit" onPress={handleEdit} color="#ff8c00" />
        <Button title="Confirm & Save" onPress={handleConfirm} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, color: '#555' },
  value: { fontSize: 16, marginBottom: 10, padding: 8, backgroundColor: '#f4f4f4', borderRadius: 4 },
  buttonRow: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 30, marginBottom: 50 },
  imageContainer: { marginBottom: 15, alignItems: 'center' },
  imagePreview: { width: '100%', height: 200, borderRadius: 10, resizeMode: 'cover', marginTop: 5 },
});

export default ConfirmationScreen;