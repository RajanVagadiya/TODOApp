import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const Details = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { title = '', desc = '', date = '' } = route.params || {};

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString;
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{title}</Text>
            {date && (
              <Text style={styles.dateText}>
                Created: {formatDate(date)}
              </Text>
            )}
          </View>

          <View style={styles.divider} />

          <View style={styles.descriptionSection}>
            <Text style={styles.sectionLabel}>Description</Text>
            <Text style={styles.description}>
              {desc && desc.trim() 
                ? desc 
                : 'No description provided for this task.'
              }
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0f172a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#0f172a',
    lineHeight: 32,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 14,
    color: '#6c757d',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginBottom: 20,
  },
  descriptionSection: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 24,
    textAlign: 'left',
  },
});