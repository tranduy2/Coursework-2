import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getAllHikes, deleteHike, deleteAllHikes } from '../database/Database';

const HomeScreen = ({ navigation }) => {
  const [hikes, setHikes] = useState([]);

  const loadHikes = async () => {
    try {
      const data = await getAllHikes();
      setHikes(data);
    } catch (error) { console.error(error); }
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHikes();
    });
    return unsubscribe;
  }, [navigation]);

  const handleDelete = (id) => {
    Alert.alert('Delete', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
          await deleteHike(id);
          loadHikes();
      }}
    ]);
  };

  const handleReset = () => {
    Alert.alert('Warning', 'Delete ALL data?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'DELETE ALL', style: 'destructive', onPress: async () => {
          await deleteAllHikes();
          loadHikes();
      }}
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardSub}>{item.location} • {item.date}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity onPress={() => navigation.navigate('AddHike', { hikeToEdit: item })}>
          <Text style={styles.actionTextEdit}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)}>
          <Text style={styles.actionTextDelete}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={() => navigation.navigate('AddHike')}
      >
        <Text style={styles.addButtonText}>ADD NEW HIKE</Text>
      </TouchableOpacity>

      <FlatList
        data={hikes}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        style={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>No hikes yet.</Text>}
      />

      <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
        <Text style={styles.resetButtonText}>DELETE ALL HIKES</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f5f5f5' },
  
  addButton: { backgroundColor: '#63701D', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 2 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', color: '#172C10' },
  cardSub: { color: '#666', marginTop: 4 },
  
  cardActions: { flexDirection: 'column', alignItems: 'flex-end', gap: 10 },
  actionTextEdit: { color: '#007AFF', fontWeight: 'bold' },
  actionTextDelete: { color: '#FF3B30', fontWeight: 'bold' },

  resetButton: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  resetButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  
  empty: { textAlign: 'center', marginTop: 50, color: '#999' }
});

export default HomeScreen;