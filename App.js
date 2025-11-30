import React, { useEffect, useState } from 'react'; 
import { ActivityIndicator, View, StyleSheet, Alert } from 'react-native';
import AppNavigator from './app/navigation/AppNavigator';
import { initDB } from './app/database/Database';

const App = () => {
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB(); 
        console.log('Database initialized successfully');
        setDbInitialized(true);
      } catch (error) {
        console.error('Error initializing database:', error);
        Alert.alert('Error', 'Failed to initialize database.');
      }
    };

    initializeDB();
  }, []);

  if (!dbInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return <AppNavigator />;
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;