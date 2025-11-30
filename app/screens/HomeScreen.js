import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {
  getAllHikes,
  deleteHike,
  deleteAllHikes,
} from '../database/Database';

const HomeScreen = ({ navigation }) => {
  const [hikes, setHikes] = useState([]);

  // Hàm tải dữ liệu
  const loadHikes = async () => {
    try {
      const data = await getAllHikes();
      setHikes(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to load hikes.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadHikes();
    });

    return unsubscribe;
  }, [navigation]);

  const handleDeleteHike = (id) => {
    Alert.alert(
      'Delete Hike',
      'Are you sure you want to delete this hike?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteHike(id);
              Alert.alert('Success', 'Hike deleted.');
              loadHikes();
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to delete hike.');
            }
          },
        },
      ],
    );
  };

  const handleResetAll = () => {
    Alert.alert(
      'Reset Database',
      'Are you sure you want to delete ALL hikes? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'DELETE ALL',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAllHikes();
              Alert.alert('Success', 'All hikes have been deleted.');
              setHikes([]);
            } catch (error) {
              console.error(error);
              Alert.alert('Error', 'Failed to reset database.');
            }
          },
        },
      ],
    );
  };

  // Render 1 item trong FlatList
  const renderHikeItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.location} - {item.date}
        </Text>
        <Text style={styles.itemDetails}>
          Length: {item.length} km, Difficulty: {item.difficulty}
        </Text>
      </View>
      <View style={styles.itemActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => navigation.navigate('AddHike', { hikeToEdit: item })}>
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteHike(item.id)}>
          <Text style={styles.actionButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Add New Hike"
        onPress={() => navigation.navigate('AddHike')}
      />

      <FlatList
        data={hikes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderHikeItem}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hikes found. Add one!</Text>
        }
        style={styles.list}
      />

      <Button
        title="Reset (Delete All Hikes)"
        onPress={handleResetAll}
        color="#c00"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  list: {
    marginTop: 10,
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 3,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
  },
  itemActions: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  actionButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginVertical: 3,
  },
  editButton: {
    backgroundColor: '#007bff',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },
});

export default HomeScreen;