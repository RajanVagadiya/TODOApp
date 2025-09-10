// screens/AddTodo.js
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { getDBConnection, addTodo } from './db';

const AddTodo = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [db, setDB] = useState(null);

  useEffect(() => {
    const d = getDBConnection();
    setDB(d);
  }, []);

  const saveAdd = async () => {
    if (!title.trim()) {
      return Alert.alert('Validation', 'Please enter a title!');
    }
    try {
      await addTodo(db, title.trim(), desc.trim());
      setTitle('');
      setDesc('');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', String(err));
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.heading}>Create New Task</Text>

          <TextInput
            style={styles.input}
            value={title}
            placeholder="Title"
            placeholderTextColor="#9aa4ad"
            onChangeText={setTitle}
          />

          <TextInput
            style={[styles.input, styles.descInput]}
            value={desc}
            placeholder="Description"
            placeholderTextColor="#9aa4ad"
            multiline
            onChangeText={setDesc}
          />

          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.9}
            onPress={saveAdd}
          >
            <Text style={styles.saveText}>Save Task</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default AddTodo;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F6F8FA',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 18,
    textAlign: 'center',
    color: '#0f172a',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E6E9EE',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
    color: '#12263a',
  },
  descInput: { height: 120, textAlignVertical: 'top' },
  saveBtn: {
    backgroundColor: '#0f172a',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  saveText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
