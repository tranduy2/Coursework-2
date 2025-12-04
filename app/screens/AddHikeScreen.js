import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  ScrollView, 
  Platform, 
  TouchableOpacity, 
  Alert, 
  Image 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { updateHike } from '../database/Database';

const AddHikeScreen = ({ navigation, route }) => {
  const hikeToEdit = route.params?.hikeToEdit;
  const isEditMode = !!hikeToEdit;

  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date());
  const [parking, setParking] = useState('Yes');
  const [length, setLength] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [description, setDescription] = useState('');
  
  const [runnerName, setRunnerName] = useState(''); 
  const [weather, setWeather] = useState('');       
  
  const [image, setImage] = useState(null);
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
      setRunnerName(hikeToEdit.runner_name || '');
      setWeather(hikeToEdit.weather_condition || '');
      setImage(hikeToEdit.image || null);
    }
  }, [isEditMode, hikeToEdit]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false, 
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Can't open the library");
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const validateForm = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = 'Required';
    if (!location.trim()) newErrors.location = 'Required';
    if (!length.trim()) newErrors.length = 'Required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (validateForm()) {
      const hikeData = {
        name, location,
        date: date.toLocaleDateString('en-CA'),
        parking, length: parseFloat(length), difficulty, description,
        runner_name: runnerName,
        weather_condition: weather,
        image: image,
      };

      if (isEditMode) {
        try {
          await updateHike({ ...hikeData, id: hikeToEdit.id });
          Alert.alert('Success', 'Hike updated successfully!');
          navigation.navigate('Home');
        } catch (error) { console.error(error); }
      } else {
        navigation.navigate('Confirmation', { hikeData: hikeData });
      }
    } else {
      Alert.alert('Missing Info', 'Please check required fields.');
    }
  };

  const CustomButton = ({ title, onPress, color, textColor = '#fff' }) => (
    <TouchableOpacity style={[styles.customBtn, { backgroundColor: color }]} onPress={onPress}>
      <Text style={[styles.customBtnText, { color: textColor }]}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      
      <Text style={styles.label}>Hike Name *</Text>
      <TextInput style={styles.input}
                 value={name} 
                 onChangeText={setName} 
                 placeholder="e.g., Mount Fansipan" />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      <Text style={styles.label}>Location *</Text>
      <TextInput style={styles.input} 
                  value={location} 
                  onChangeText={setLocation} 
                  placeholder="e.g., Sapa" />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      <Text style={styles.label}>Runner Name (Optional)</Text>
      <TextInput style={styles.input} 
                  value={runnerName} 
                  onChangeText={setRunnerName} 
                  placeholder="Hiker Name" />

      <Text style={styles.label}>Weather Condition (Optional)</Text>
      <TextInput style={styles.input}   
                  value={weather} 
                  onChangeText={setWeather} 
                  placeholder="Sunny/Rainy" />

      <Text style={styles.label}>Date of the Hike *</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput style={styles.input} 
                   value={date.toLocaleDateString()} 
                   editable={false} />
      </TouchableOpacity>
      {showDatePicker && <DateTimePicker value={date} mode="date" display="default" onChange={onDateChange} />}

      <Text style={styles.label}>Parking Available *</Text>
      <View style={styles.radioContainer}>
        {['Yes', 'No'].map((opt) => (
          <TouchableOpacity key={opt} 
                            style={[styles.radioButton, parking === opt && styles.radioButtonSelected]} 
                            onPress={() => setParking(opt)}>
            <Text style={[styles.radioText, parking === opt && styles.radioTextSelected]}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Hike Length (km) *</Text>
      <TextInput style={styles.input} 
                 value={length} 
                 onChangeText={setLength} 
                 placeholder="10.5" 
                 keyboardType="numeric" />
      {errors.length && <Text style={styles.errorText}>{errors.length}</Text>}

      <Text style={styles.label}>Difficulty Level *</Text>
      <View style={styles.radioContainer}>
        {['Easy', 'Medium', 'Hard'].map((level) => (
          <TouchableOpacity 
          key={level} style={[styles.radioButton, 
          difficulty === level && styles.radioButtonSelected]} onPress={() => setDifficulty(level)}>
            <Text style={[styles.radioText, difficulty === level && styles.radioTextSelected]}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput style={[styles.input, styles.textArea]} 
                        value={description} 
                        onChangeText={setDescription} 
                        placeholder="Notes..." 
                        multiline={true} 
                        numberOfLines={3} />

      <Text style={styles.label}>Hike Photo (Optional)</Text>
      <View style={{ marginBottom: 10 }}>
        <CustomButton title="Pick from Gallery 🖼️" 
                      onPress={pickImage} 
                      color="#85BEA3" 
                      textColor="#172C10" />
      </View>

      {image && (
        <Image source={{ uri: image }} style={styles.imagePreview} />
      )}

      <View style={styles.buttonContainer}>
        <CustomButton 
          title={isEditMode ? 'UPDATE HIKE' : 'SAVE & REVIEW'} 
          onPress={handleSave} 
          color="#63701D" 
        />
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 15, marginBottom: 5, color: '#172C10' },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, backgroundColor: '#f9f9f9', fontSize: 16 },
  textArea: { height: 80, textAlignVertical: 'top' },
  errorText: { color: '#FF3B30', fontSize: 12, marginTop: 3 },
  
  radioContainer: { flexDirection: 'row', justifyContent: 'space-between' },
  radioButton: { flex: 1, padding: 12, borderWidth: 1, borderColor: '#ccc', alignItems: 'center', backgroundColor: '#f0f0f0', marginHorizontal: 2, borderRadius: 8 },
  radioButtonSelected: { backgroundColor: '#63701D', borderColor: '#63701D' },
  radioText: { fontSize: 16, color: '#333' },
  radioTextSelected: { color: '#fff', fontWeight: 'bold' },

  imagePreview: { width: '100%', height: 200, borderRadius: 10, marginTop: 10, marginBottom: 10, resizeMode: 'cover', borderWidth: 1, borderColor: '#ddd' },

  buttonContainer: { marginTop: 20, marginBottom: 50 },
  customBtn: { padding: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  customBtnText: { fontSize: 16, fontWeight: 'bold' }
});

export default AddHikeScreen;