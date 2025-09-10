// screens/Home.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import {
  getDBConnection,
  createTable,
  getTodos,
  addTodo,
  updatedTodo,
  deleteTodo,
} from './db';

const Home = ({ navigation }) => {
  const [db, setDB] = useState(null);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  useEffect(() => {
    initDb();
  }, []);

  
  useFocusEffect(
    useCallback(() => {
      refreshTodos();
    }, [db]),
  );

  const initDb = async () => {
    try {
      const dbConn = getDBConnection();
      setDB(dbConn);
      await createTable(dbConn);
      const items = await getTodos(dbConn);
      setTodos(items);
    } catch (error) {
      console.log('Database error:', error);
      Alert.alert('DB Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const refreshTodos = async () => {
    if (!db) return;
    const items = await getTodos(db);
    setTodos(items);
  };

  const handleDelete = id => {
    Alert.alert('Confirm', 'Delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTodo(db, id);
          refreshTodos();
        },
      },
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate('details', { title: item.title, desc: item.desc })
        }
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.desc ? <Text style={styles.itemDesc}>{item.desc}</Text> : null}
        <Text style={styles.itemDate}>{item.created_at}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FFD93D' }]}
          onPress={() => {
            setEditing(item);
            setIsEditModalVisible(true);
          }}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, { backgroundColor: '#FF6B6B' }]}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const handleEditSave = async () => {
    if (!editing?.title?.trim()) {
      return Alert.alert('Validation', 'Title is required');
    }
    await updatedTodo(
      db,
      editing.id,
      editing.title.trim(),
      editing.desc?.trim() || '',
    );
    setIsEditModalVisible(false);
    setEditing(null);
    refreshTodos();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My TODOs</Text>
        <TouchableOpacity
          style={styles.addFloating}
          onPress={() => navigation.navigate('addTodo')}
        >
          <Text style={styles.addFloatingText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0f172a"
          style={{ marginTop: 30 }}
        />
      ) : todos.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyTitle}>No todos yet</Text>
          <Text style={styles.emptySub}>
            Tap +Add to create your first task
          </Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      {/* Edit Modal */}
      <Modal visible={isEditModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalHeader}>Edit Todo</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editing?.title}
              onChangeText={val => setEditing({ ...editing, title: val })}
            />
            <TextInput
              style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Description"
              value={editing?.desc}
              multiline
              onChangeText={val => setEditing({ ...editing, desc: val })}
            />
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                onPress={() => {
                  setIsEditModalVisible(false);
                  setEditing(null);
                }}
              />
              <Button title="Save" onPress={handleEditSave} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F6F8FA' },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  header: { fontSize: 24, fontWeight: '700', color: '#0f172a' },
  addFloating: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 4,
  },
  addFloatingText: { color: '#fff', fontWeight: '700' },
  emptyBox: { marginTop: 40, alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
  emptySub: { color: '#777', marginTop: 6 },

  item: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 2,
  },
  itemTitle: { fontSize: 16, fontWeight: '700', color: '#0f172a' },
  itemDesc: { fontSize: 14, color: '#5b6770', marginTop: 6 },
  itemDate: { fontSize: 12, color: '#9aa4ad', marginTop: 8 },

  actions: { flexDirection: 'column', marginLeft: 12 },
  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  actionText: { fontWeight: '700' },

  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 20,
  },
  modal: { backgroundColor: '#FFF', borderRadius: 12, padding: 18 },
  modalHeader: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: '#E6E9EE',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  modalActions: { flexDirection: 'row', justifyContent: 'space-between' },
});
