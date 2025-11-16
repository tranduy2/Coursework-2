import React, { useEffect } from 'react';
import AppNavigator from './app/navigation/AppNavigator';
import { initDB } from './app/database/Database';
import { Alert } from 'react-native';

const App = () => {
  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDB();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
        Alert.alert('Error', 'Failed to initialize database.');
      }
    };

    initializeDB();
  }, []);

  return <AppNavigator />;
};

export default App;