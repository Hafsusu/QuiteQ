import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute } from '@react-navigation/native';
import { COLORS } from '@/constants/colors';
import { RootStackParamList } from '@/@types/navigation';

type ModeDetailRouteProp = RouteProp<RootStackParamList, 'ModeDetail'>;

export const ModeDetailScreen = () => {
  const route = useRoute<ModeDetailRouteProp>();
  const { modeId } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mode Details</Text>
        <Text style={styles.subtitle}>Configure your settings</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.modeId}>Mode ID: {modeId}</Text>
        <Text style={styles.message}>Mode detail screen coming soon!</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 24,
    backgroundColor: COLORS.primary[900],
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.primary[200],
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
  },
  modeId: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginBottom: 24,
  },
  message: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
});