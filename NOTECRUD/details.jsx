// screens/Details.js
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React from 'react';
import { useRoute } from '@react-navigation/native';

const Details = () => {
  const route = useRoute();
  const { title = '', desc = '' } = route.params || {};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.dateLabel}>Details</Text>
        <Text style={styles.desc}>
          {desc ? desc : 'No description provided.'}
        </Text>
      </View>
    </ScrollView>
  );
};

export default Details;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 18,
    elevation: 4,
  },
  title: { fontSize: 20, fontWeight: '800', color: '#0f172a', marginBottom: 8 },
  dateLabel: { color: '#9aa4ad', fontWeight: '700', marginBottom: 12 },
  desc: { fontSize: 15, color: '#333', lineHeight: 22 },
});
