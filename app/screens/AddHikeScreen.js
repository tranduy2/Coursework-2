import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert,} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateHike } from '../database/Database';


const AddHikeScreen = ({ navigation, route }) => {
  const hikeToEdit = route.params?.hikeToEdit;
  const isEditMode = !!hikeToEdit;

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date()); 
  const [parking, setParking] = useState('No'); 
  const [length, setLength] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  const [customField1, setCustomField1] = useState('');
  const [customField2, setCustomField2] = useState('');

  const [errors, setErrors] = useState({});

  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      setName(hikeToEdit.name);
      setLocation(hikeToEdit.location);
      setDate(new Date(hikeToEdit.date)); 
      setParking(hikeToEdit.parking);
      setLength(String(hikeToEdit.length)); 
      setDifficulty(hikeToEdit.difficulty);
      setDescription(hikeToEdit.description || '');
      setCustomField1(hikeToEdit.custom_field1 || '');
      setCustomField2(hikeToEdit.custom_field2 || '');
    }
  }, [isEditMode, hikeToEdit]);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); 
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!length.trim()) {
      newErrors.length = 'Length is required';
    } else if (isNaN(Number(length)) || Number(length) <= 0) {
      newErrors.length = 'Length must be a positive number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const hikeData = {
        name,
        location,
        date: date.toLocaleDateString('en-CA'),
        parking,
        length: parseFloat(length),
        difficulty,
        description,
        custom_field1: customField1,
        custom_field2: customField2,
      };

      if (isEditMode) {
        try {
          await updateHike({ ...hikeData, id: hikeToEdit.id });
          Alert.alert('Success', 'Hike updated successfully!');
          navigation.navigate('Home'); 
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to update hike.');
        }
      } else {
        navigation.navigate('Confirmation', { hikeData: hikeData });
      }
    } else {
      Alert.alert('Validation Error', 'Please check the required fields.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.label}>Hike Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g., Mount Fansipan"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}


      <Text style={styles.label}>Location *</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="e.g., Sapa, Vietnam"
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}


      <Text style={styles.label}>Date of the Hike *</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={date.toLocaleDateString()} 
          editable={false} 
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}


      <Text style={styles.label}>Parking Available *</Text>
      <View style={styles.radioContainer}>
        <TouchableOpacity 
          style={[styles.radioButton, parking === 'Yes' && styles.radioButtonSelected]} 
          onPress={() => setParking('Yes')}
        >
          <Text style={[styles.radioText, parking === 'Yes' && styles.radioTextSelected]}>Yes</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.radioButton, parking === 'No' && styles.radioButtonSelected]} 
          onPress={() => setParking('No')}
        >
          <Text style={[styles.radioText, parking === 'No' && styles.radioTextSelected]}>No</Text>
        </TouchableOpacity>
      </View>


      <Text style={styles.label}>Hike Length (km) *</Text>
      <TextInput
        style={styles.input}
        value={length}
        onChangeText={setLength}
        placeholder="e.g., 10.5"
        keyboardType="numeric"
      />
      {errors.length && <Text style={styles.errorText}>{errors.length}</Text>}


      <Text style={styles.label}>Difficulty Level *</Text>
      <View style={styles.radioContainer}>
        {['Easy', 'Medium', 'Hard'].map((level) => (
          <TouchableOpacity
            key={level}
            style={[styles.radioButton, difficulty === level && styles.radioButtonSelected]}
            onPress={() => setDifficulty(level)}
          >
            <Text style={[styles.radioText, difficulty === level && styles.radioTextSelected]}>
              {level}
            </Text>
          </TouchableOpacity>
        ))}
      </View>


      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Notes about the hike..."
        multiline={true}
        numberOfLines={3}
      />

      <Text style={styles.label}>Custom Field 1 (Optional)</Text>
      <TextInput
        style={styles.input}
        value={customField1}
        onChangeText={setCustomField1}
      />
      <Text style={styles.label}>Custom Field 2 (Optional)</Text>
      <TextInput
        style={styles.input}
        value={customField2}
        onChangeText={setCustomField2}
      />

      <View style={styles.buttonContainer}>
        <Button
          title={isEditMode ? 'Update Hike' : 'Save and Review'}
          onPress={handleSave}
        />
      </View>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 3,
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 50,
  },
  radioContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  radioButton: {
    flex: 1,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    marginHorizontal: 2,
    borderRadius: 5,
  },
  radioButtonSelected: {
    backgroundColor: '#007AFF', 
    borderColor: '#007AFF',
  },
  radioText: {
    fontSize: 16,
    color: '#333',
  },
  radioTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddHikeScreen;