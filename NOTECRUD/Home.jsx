import React, { useEffect, useState, useCallback,useLayoutEffect } from 'react';
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

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
      <View style={styles.customHeader}>
        <Text style={styles.headerTitle}>MyTODO</Text>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6366f1"
          style={styles.loader}
        />
      ) : todos.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No todos found</Text>
          <Text style={styles.emptySubtitle}>
            Tap + to create your first task
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
      
      <TouchableOpacity
        style={styles.floatingAddBtn}
        onPress={() => navigation.navigate('addTodo')}
      >
        <Text style={styles.addBtnText}>+</Text>
      </TouchableOpacity>

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
              placeholderTextColor="#94a3b8"
              value={editing?.title || ''}
              onChangeText={val => setEditing({ ...editing, title: val })}
              autoFocus
            />
            
            <TextInput
              style={[styles.input, styles.descInput]}
              placeholder="Description"
              placeholderTextColor="#94a3b8"
              value={editing?.desc || ''}
              multiline
              onChangeText={val => setEditing({ ...editing, desc: val })}
            />
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={closeEditModal}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.saveButton}
                onPress={handleEditSave}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
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
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  customHeader: {
    paddingVertical: 22,
    paddingHorizontal: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  headerTitle: {
    marginTop : 12,
    fontSize: 24,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  floatingAddBtn: {
    position: 'absolute',
    bottom: 50,
    right: 22,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    zIndex: 100,
  },
  addBtnText: { 
    color: '#fff', 
    fontWeight: '700',
    fontSize: 28,
  },
  loader: { 
    marginTop: 80 
  },
  emptyState: { 
    flex: 1,
    marginTop: 100, 
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  emptyTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#334155',
    marginBottom: 12
  },
  emptySubtitle: { 
    color: '#64748b', 
    fontSize: 16,
    textAlign: 'center',
  },
  listContainer: { 
    padding: 16,
    paddingBottom: 100,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#64748b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderWidth: 1,
    borderColor: '#f1f5f9',
  },
  itemContent: { 
    flex: 1 
  },
  itemTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1e293b',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  itemDesc: { 
    fontSize: 15, 
    color: '#475569', 
    marginBottom: 10,
    lineHeight: 22
  },
  itemDate: { 
    fontSize: 13, 
    color: '#94a3b8',
    fontWeight: '500',
  },
  actions: { 
    flexDirection: 'column',
    marginLeft: 14,
    justifyContent: 'center',
    gap: 8,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center'
  },
  editBtn: {
    backgroundColor: '#eab308'
  },
  deleteBtn: {
    backgroundColor: '#ef4444'
  },
  actionText: { 
    fontWeight: '600',
    color: '#fff',
    fontSize: 13
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(15,23,42,0.6)',
    padding: 20,
  },
  modalContainer: { 
    backgroundColor: '#ffffff', 
    borderRadius: 20, 
    padding: 24,
    elevation: 10,
    shadowColor: '#0f172a',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  modalTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    marginBottom: 20,
    textAlign: 'center',
    color: '#1e293b',
    letterSpacing: -0.3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    color: '#1e293b',
    backgroundColor: '#f8fafc',
  },
  descInput: { 
    height: 120, 
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  modalActions: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelButtonText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
});