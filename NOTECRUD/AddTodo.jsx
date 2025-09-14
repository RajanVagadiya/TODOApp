import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { getDBConnection, addTodo } from './db';

const AddTodo = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [db, setDB] = useState(null);

  useEffect(() => {
    initDatabase();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const initDatabase = async () => {
    try {
      const database = await getDBConnection();
      setDB(database);
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to database');
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      return Alert.alert('Validation', 'Please enter a title!');
    }

    try {
      await addTodo(db, title.trim(), desc.trim());
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save todo');
    }
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create New Task</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              placeholder="Enter task title"
              placeholderTextColor="#94a3b8"
              onChangeText={setTitle}
              autoFocus
            />

            <Text style={styles.label}>Description (Optional)</Text>
            <TextInput
              style={[styles.input, styles.descInput]}
              value={desc}
              placeholder="Enter description"
              placeholderTextColor="#94a3b8"
              multiline
              onChangeText={setDesc}
            />

            <View style={styles.buttons}>
              <TouchableOpacity
                style={[styles.button, styles.cancelBtn]}
                onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.saveBtn]}
                onPress={handleSave}>
                <Text style={styles.saveText}>Save Task</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddTodo;

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  customHeader: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#6366f1',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerTitle: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    marginTop: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
  },
  headerSpacer: {
    width: 40,
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    elevation: 3,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    width: '100%',
    maxWidth: width > 500 ? 500 : '100%',
    alignSelf: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    color: '#1e293b',
  },
  descInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelBtn: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  saveBtn: {
    backgroundColor: '#6366f1',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  cancelText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },
  saveText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});