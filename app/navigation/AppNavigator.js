import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import AddHikeScreen from '../screens/AddHikeScreen';
import ConfirmationScreen from '../screens/ConfirmationScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#172C10',
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'M-Hike' }}
        />
        <Stack.Screen
          name="AddHike"
          component={AddHikeScreen}
          options={({ route }) => ({
            title: route.params?.hikeToEdit ? 'Edit Hike Details' : 'Add New Hike',
          })}
        />
        <Stack.Screen
          name="Confirmation"
          component={ConfirmationScreen}
          options={{ title: 'Confirm Details' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;