import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

interface DurationPickerProps {
  selectedDuration: number;
  defaultDuration: number;
  onDurationChange: (duration: number) => void;
  maxDuration?: number;
}

export const DurationPicker: React.FC<DurationPickerProps> = ({
  selectedDuration,
  defaultDuration,
  onDurationChange,
  maxDuration = 1440, 
}) => {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customDuration, setCustomDuration] = useState('');

  const predefinedDurations = [
    { minutes: 15, label: '15m' },
    { minutes: 30, label: '30m' },
    { minutes: 45, label: '45m' },
    { minutes: 60, label: '1h' },
    { minutes: 90, label: '1.5h' },
    { minutes: 120, label: '2h' },
    { minutes: 180, label: '3h' },
    { minutes: 240, label: '4h' },
  ];

  const handleCustomDurationSubmit = () => {
    const duration = parseInt(customDuration);
    if (isNaN(duration) || duration <= 0 || duration > maxDuration) {
      Alert.alert('Invalid Duration', `Please enter a number between 1 and ${maxDuration} minutes.`);
      return;
    }
    onDurationChange(duration);
    setShowCustomInput(false);
    setCustomDuration('');
  };

  const formatDuration = (minutes: number): string => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Duration</Text>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.durationScroll}
      >
        {predefinedDurations.map(({ minutes, label }) => (
          <TouchableOpacity
            key={minutes}
            style={[
              styles.durationOption,
              selectedDuration === minutes && styles.selectedDurationOption,
              minutes === defaultDuration && styles.defaultDurationOption,
            ]}
            onPress={() => onDurationChange(minutes)}
          >
            <Text style={[
              styles.durationText,
              selectedDuration === minutes && styles.selectedDurationText,
              minutes === defaultDuration && styles.defaultDurationText,
            ]}>
              {label}
            </Text>
            {minutes === defaultDuration && (
              <Text style={styles.defaultLabel}>default</Text>
            )}
          </TouchableOpacity>
        ))}
        
        {!showCustomInput ? (
          <TouchableOpacity
            style={[styles.durationOption, styles.customButton]}
            onPress={() => setShowCustomInput(true)}
          >
            <Icon name="pencil" size={16} color={COLORS.primary[500]} />
            <Text style={[styles.durationText, { color: COLORS.primary[500], marginLeft: 6 }]}>
              Custom
            </Text>
          </TouchableOpacity>
        ) : (
          <View style={styles.customInputContainer}>
            <TextInput
              style={styles.customInput}
              placeholder={`1-${maxDuration}`}
              placeholderTextColor={COLORS.gray[400]}
              keyboardType="numeric"
              value={customDuration}
              onChangeText={setCustomDuration}
              autoFocus
            />
            <View style={styles.customInputButtons}>
              <TouchableOpacity
                style={styles.customInputButton}
                onPress={() => {
                  setShowCustomInput(false);
                  setCustomDuration('');
                }}
              >
                <Icon name="close" size={16} color={COLORS.gray[500]} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.customInputButton, styles.submitButton]}
                onPress={handleCustomDurationSubmit}
              >
                <Icon name="check" size={16} color={COLORS.primary[500]} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
      
      <View style={styles.selectedDurationContainer}>
        <Text style={styles.selectedDurationText}>
          {formatDuration(selectedDuration)}
        </Text>
        <Text style={styles.selectedDurationLabel}>
          {selectedDuration === defaultDuration ? 'Default duration' : 'Custom duration'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  durationScroll: {
    flexDirection: 'row',
  },
  durationOption: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  selectedDurationOption: {
    backgroundColor: COLORS.primary[500],
  },
  defaultDurationOption: {
    borderWidth: 1,
    borderColor: COLORS.primary[300],
  },
  customButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary[50],
    borderWidth: 1,
    borderColor: COLORS.primary[200],
  },
  durationText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  selectedDurationText: {
    color: '#fff',
  },
  defaultDurationText: {
    color: COLORS.primary[600],
  },
  defaultLabel: {
    fontSize: 10,
    color: COLORS.primary[500],
    marginTop: 2,
    fontWeight: '500',
  },
  customInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  customInput: {
    width: 60,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text.primary,
  },
  customInputButtons: {
    flexDirection: 'row',
  },
  customInputButton: {
    padding: 8,
  },
  submitButton: {
    marginLeft: 4,
  },
  selectedDurationContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedDurationLabel: {
    fontSize: 12,
    color: COLORS.gray[600],
    marginTop: 2,
  },
});