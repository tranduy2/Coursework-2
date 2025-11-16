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
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { updateHike } from '../database/Database'; // Import hàm update

const AddHikeScreen = ({ navigation, route }) => {
  // Lấy hikeToEdit từ params (nếu có)
  const hikeToEdit = route.params?.hikeToEdit;
  const isEditMode = !!hikeToEdit;

  // States cho các trường
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState(new Date()); // Dùng object Date
  const [parking, setParking] = useState('No'); // Mặc định 'No'
  const [length, setLength] = useState('');
  const [difficulty, setDifficulty] = useState('Easy'); // Mặc định 'Easy'
  const [description, setDescription] = useState('');
  const [customField1, setCustomField1] = useState('');
  const [customField2, setCustomField2] = useState('');

  // States cho lỗi
  const [errors, setErrors] = useState({});

  // State cho DatePicker
  const [showDatePicker, setShowDatePicker] = useState(false);

  // useEffect để điền dữ liệu nếu là chế độ Edit
  useEffect(() => {
    if (isEditMode) {
      setName(hikeToEdit.name);
      setLocation(hikeToEdit.location);
      setDate(new Date(hikeToEdit.date)); // Chuyển string từ DB về Date
      setParking(hikeToEdit.parking);
      setLength(String(hikeToEdit.length)); // Chuyển số về string
      setDifficulty(hikeToEdit.difficulty);
      setDescription(hikeToEdit.description || '');
      setCustomField1(hikeToEdit.custom_field1 || '');
      setCustomField2(hikeToEdit.custom_field2 || '');
    }
  }, [isEditMode, hikeToEdit]);

  // Hàm xử lý khi chọn ngày
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios'); // Tắt modal trên iOS
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  // Hàm validation
  const validateForm = () => {
    let newErrors = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    if (!length.trim()) {
      newErrors.length = 'Length is required';
    } else if (isNaN(Number(length)) || Number(length) <= 0) {
      newErrors.length = 'Length must be a positive number';
    }
    // Date, Parking, Difficulty luôn có giá trị mặc định nên không cần check

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  // Hàm xử lý khi nhấn nút Save
  const handleSave = async () => {
    if (validateForm()) {
      const hikeData = {
        name,
        location,
        date: date.toISOString().split('T')[0], // Format: YYYY-MM-DD
        parking,
        length: parseFloat(length),
        difficulty,
        description,
        custom_field1: customField1,
        custom_field2: customField2,
      };

      if (isEditMode) {
        // --- CHẾ ĐỘ EDIT (Task f) ---
        try {
          await updateHike({ ...hikeData, id: hikeToEdit.id });
          Alert.alert('Success', 'Hike updated successfully!');
          navigation.navigate('Home'); // Quay về Home sau khi update
        } catch (error) {
          console.error(error);
          Alert.alert('Error', 'Failed to update hike.');
        }
      } else {
        // --- CHẾ ĐỘ ADD MỚI (Task e) ---
        // Chuyển sang màn hình Confirmation
        navigation.navigate('Confirmation', { hikeData: hikeData });
      }
    } else {
      Alert.alert('Validation Error', 'Please check the required fields.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Name */}
      <Text style={styles.label}>Hike Name *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="e.g., Mount Fansipan"
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

      {/* Location */}
      <Text style={styles.label}>Location *</Text>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="e.g., Sapa, Vietnam"
      />
      {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

      {/* Date */}
      <Text style={styles.label}>Date of the Hike *</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          value={date.toLocaleDateString()} // Hiển thị ngày đã chọn
          editable={false} // Không cho gõ tay
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

      {/* Parking */}
      <Text style={styles.label}>Parking Available *</Text>
      <Picker
        selectedValue={parking}
        style={styles.picker}
        onValueChange={(itemValue) => setParking(itemValue)}>
        <Picker.Item label="No" value="No" />
        <Picker.Item label="Yes" value="Yes" />
      </Picker>

      {/* Length */}
      <Text style={styles.label}>Hike Length (km) *</Text>
      <TextInput
        style={styles.input}
        value={length}
        onChangeText={setLength}
        placeholder="e.g., 10.5"
        keyboardType="numeric"
      />
      {errors.length && <Text style={styles.errorText}>{errors.length}</Text>}

      {/* Difficulty */}
      <Text style={styles.label}>Difficulty Level *</Text>
      <Picker
        selectedValue={difficulty}
        style={styles.picker}
        onValueChange={(itemValue) => setDifficulty(itemValue)}>
        <Picker.Item label="Easy" value="Easy" />
        <Picker.Item label="Medium" value="Medium" />
        <Picker.Item label="Hard" value="Hard" />
      </Picker>

      {/* Description (Optional) */}
      <Text style={styles.label}>Description (Optional)</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        value={description}
        onChangeText={setDescription}
        placeholder="Notes about the hike..."
        multiline={true}
        numberOfLines={3}
      />

      {/* Custom Fields (Optional) */}
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
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
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
});

export default AddHikeScreen;