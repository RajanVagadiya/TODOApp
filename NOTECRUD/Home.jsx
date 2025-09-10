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
      if (db) {
        refreshTodos();
      }
    }, [db]),
  );

  const initDb = async () => {
    try {
      const dbConn = await getDBConnection();
      setDB(dbConn);
      await createTable(dbConn);
      const items = await getTodos(dbConn);
      setTodos(items);
    } catch (error) {
      console.error('Database error:', error);
      Alert.alert('DB Error', String(error));
    } finally {
      setLoading(false);
    }
  };

  const refreshTodos = async () => {
    if (!db) return;
    try {
      const items = await getTodos(db);
      setTodos(items);
    } catch (error) {
      console.error('Error refreshing todos:', error);
    }
  };

  const handleDelete = id => {
    Alert.alert('Confirm', 'Delete this todo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTodo(db, id);
            refreshTodos();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete todo');
          }
        },
      },
    ]);
  };

  const formatDate = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <TouchableOpacity
        style={styles.itemContent}
        onPress={() =>
          navigation.navigate('details', { 
            title: item.title, 
            desc: item.desc || '',
            date: formatDate(item.created_at)
          })
        }
      >
        <Text style={styles.itemTitle}>{item.title}</Text>
        {item.desc ? <Text style={styles.itemDesc}>{item.desc}</Text> : null}
        <Text style={styles.itemDate}>{formatDate(item.created_at)}</Text>
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionBtn, styles.editBtn]}
          onPress={() => {
            setEditing({ ...item });
            setIsEditModalVisible(true);
          }}
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionBtn, styles.deleteBtn]}
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
    
    try {
      await updatedTodo(
        db,
        editing.id,
        editing.title.trim(),
        editing.desc?.trim() || '',
      );
      setIsEditModalVisible(false);
      setEditing(null);
      refreshTodos();
    } catch (error) {
      Alert.alert('Error', 'Failed to update todo');
    }
  };

  const closeEditModal = () => {
    setIsEditModalVisible(false);
    setEditing(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My TODOs</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('addTodo')}
        >
          <Text style={styles.addBtnText}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#0f172a"
          style={styles.loader}
        />
      ) : todos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No todos found</Text>
          <Text style={styles.emptySubtitle}>
            Tap +Add to create your first task
          </Text>
        </View>
      ) : (
        <FlatList
          data={todos}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal 
        visible={isEditModalVisible} 
        transparent 
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Todo</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Title"
              placeholderTextColor="#9aa4ad"
              value={editing?.title || ''}
              onChangeText={val => setEditing({ ...editing, title: val })}
              autoFocus
            />
            
            <TextInput
              style={[styles.input, styles.descInput]}
              placeholder="Description"
              placeholderTextColor="#9aa4ad"
              value={editing?.desc || ''}
              multiline
              onChangeText={val => setEditing({ ...editing, desc: val })}
            />
            
            <View style={styles.modalActions}>
              <Button
                title="Cancel"
                color="#666"
                onPress={closeEditModal}
              />
              <Button 
                title="Save" 
                onPress={handleEditSave} 
              />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f8f9fa' 
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  header: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: '#0f172a' 
  },
  addBtn: {
    backgroundColor: '#4ECDC4',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addBtnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 14
  },
  loader: { 
    marginTop: 50 
  },
  emptyState: { 
    marginTop: 80, 
    alignItems: 'center' 
  },
  emptyTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#333',
    marginBottom: 8
  },
  emptySubtitle: { 
    color: '#777', 
    fontSize: 16
  },
  listContainer: { 
    paddingBottom: 20 
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  itemContent: { 
    flex: 1 
  },
  itemTitle: { 
    fontSize: 17, 
    fontWeight: '600', 
    color: '#0f172a',
    marginBottom: 4
  },
  itemDesc: { 
    fontSize: 14, 
    color: '#5b6770', 
    marginBottom: 8,
    lineHeight: 20
  },
  itemDate: { 
    fontSize: 12, 
    color: '#9aa4ad'
  },
  actions: { 
    flexDirection: 'column',
    marginLeft: 12,
    justifyContent: 'center'
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 6,
    minWidth: 60,
    alignItems: 'center'
  },
  editBtn: {
    backgroundColor: '#ffc107'
  },
  deleteBtn: {
    backgroundColor: '#dc3545'
  },
  actionText: { 
    fontWeight: '600',
    color: '#fff',
    fontSize: 12
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  modalContainer: { 
    backgroundColor: '#ffffff', 
    borderRadius: 16, 
    padding: 20,
    elevation: 10
  },
  modalTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 16,
    textAlign: 'center',
    color: '#0f172a'
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    color: '#0f172a'
  },
  descInput: { 
    height: 100, 
    textAlignVertical: 'top' 
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-around',
    marginTop: 8
  },
});