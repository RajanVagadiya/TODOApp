import React, { useLayoutEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  KeyboardAvoidingView,
  Platform
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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false
    });
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Details;

const { width, height } = Dimensions.get('window');

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
    marginTop : 16,
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    marginTop : 16,
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
    paddingBottom: 40,
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
  titleSection: {
    marginBottom: 20,
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#1e293b',
    lineHeight: 32,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  dateText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 20,
  },
  descriptionSection: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 24,
    textAlign: 'left',
  },
});