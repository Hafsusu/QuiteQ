import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

export type ScheduleType = 'manual' | 'scheduled' | 'recurring' | 'geofence';

export interface ScheduleConfig {
  type: ScheduleType;
  startTime?: Date;
  endTime?: Date;
  daysOfWeek?: number[];
  locationId?: string;
}

interface SchedulePickerProps {
  selectedSchedule: ScheduleConfig;
  onScheduleChange: (schedule: ScheduleConfig) => void;
  modeCanSchedule: boolean;
  modeCanGeofence: boolean;
}

export const SchedulePicker: React.FC<SchedulePickerProps> = ({
  selectedSchedule,
  onScheduleChange,
  modeCanSchedule,
  modeCanGeofence,
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [timePickerType, setTimePickerType] = useState<'start' | 'end'>('start');
//   const [showDaysPicker, setShowDaysPicker] = useState(false);

  const scheduleOptions = [
    {
      type: 'manual' as ScheduleType,
      icon: 'power',
      title: 'Manual',
      description: 'Activate manually when needed',
      enabled: true,
    },
    {
      type: 'scheduled' as ScheduleType,
      icon: 'clock',
      title: 'Scheduled',
      description: 'Set specific times automatically',
      enabled: modeCanSchedule,
    },
    {
      type: 'recurring' as ScheduleType,
      icon: 'calendar-repeat',
      title: 'Recurring',
      description: 'Repeat on specific days/times',
      enabled: modeCanSchedule,
    },
    {
      type: 'geofence' as ScheduleType,
      icon: 'map-marker',
      title: 'Location',
      description: 'Activate when entering locations',
      enabled: modeCanGeofence,
    },
  ];

  const daysOfWeek = [
    { id: 0, label: 'Sun', name: 'Sunday' },
    { id: 1, label: 'Mon', name: 'Monday' },
    { id: 2, label: 'Tue', name: 'Tuesday' },
    { id: 3, label: 'Wed', name: 'Wednesday' },
    { id: 4, label: 'Thu', name: 'Thursday' },
    { id: 5, label: 'Fri', name: 'Friday' },
    { id: 6, label: 'Sat', name: 'Saturday' },
  ];

  const handleTimeChange = (_event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      const newSchedule = { ...selectedSchedule };
      if (timePickerType === 'start') {
        newSchedule.startTime = selectedDate;
      } else {
        newSchedule.endTime = selectedDate;
      }
      onScheduleChange(newSchedule);
    }
  };

  const toggleDay = (dayId: number) => {
    const currentDays = selectedSchedule.daysOfWeek || [];
    const newDays = currentDays.includes(dayId)
      ? currentDays.filter(d => d !== dayId)
      : [...currentDays, dayId];
    
    onScheduleChange({
      ...selectedSchedule,
      daysOfWeek: newDays,
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) return 'Not set';
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDays = (days?: number[]) => {
    if (!days || days.length === 0) return 'No days selected';
    if (days.length === 7) return 'Every day';
    
    const dayLabels = days.map(dayId => 
      daysOfWeek.find(d => d.id === dayId)?.label
    );
    return dayLabels.join(', ');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activation Method</Text>
      
      <View style={styles.optionsContainer}>
        {scheduleOptions.map((option) => (
          <TouchableOpacity
            key={option.type}
            style={[
              styles.scheduleOption,
              selectedSchedule.type === option.type && styles.selectedScheduleOption,
              !option.enabled && styles.disabledOption,
            ]}
            onPress={() => option.enabled && onScheduleChange({ ...selectedSchedule, type: option.type })}
            disabled={!option.enabled}
          >
            <View style={styles.scheduleOptionHeader}>
              <View style={[
                styles.scheduleIconContainer,
                selectedSchedule.type === option.type && { backgroundColor: COLORS.primary[100] },
                !option.enabled && { backgroundColor: COLORS.gray[200] },
              ]}>
                <Icon 
                  name={option.icon} 
                  size={20} 
                  color={
                    !option.enabled ? COLORS.gray[400] :
                    selectedSchedule.type === option.type ? COLORS.primary[600] : COLORS.gray[500]
                  } 
                />
              </View>
              <View style={styles.scheduleTextContainer}>
                <Text style={[
                  styles.scheduleOptionTitle,
                  selectedSchedule.type === option.type && { color: COLORS.primary[600] },
                  !option.enabled && { color: COLORS.gray[400] },
                ]}>
                  {option.title}
                </Text>
                <Text style={[
                  styles.scheduleOptionDescription,
                  !option.enabled && { color: COLORS.gray[400] },
                ]}>
                  {option.description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {(selectedSchedule.type === 'scheduled' || selectedSchedule.type === 'recurring') && (
        <View style={styles.timePickerContainer}>
          <Text style={styles.subtitle}>Time Settings</Text>
          <View style={styles.timeButtons}>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                setTimePickerType('start');
                setShowTimePicker(true);
              }}
            >
              <Icon name="clock-start" size={16} color={COLORS.primary[500]} />
              <Text style={styles.timeButtonText}>
                Start: {formatTime(selectedSchedule.startTime)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeButton}
              onPress={() => {
                setTimePickerType('end');
                setShowTimePicker(true);
              }}
            >
              <Icon name="clock-end" size={16} color={COLORS.primary[500]} />
              <Text style={styles.timeButtonText}>
                End: {formatTime(selectedSchedule.endTime)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedSchedule.type === 'recurring' && (
        <View style={styles.daysContainer}>
          <Text style={styles.subtitle}>Repeat on</Text>
          <View style={styles.daysGrid}>
            {daysOfWeek.map((day) => (
              <TouchableOpacity
                key={day.id}
                style={[
                  styles.dayButton,
                  selectedSchedule.daysOfWeek?.includes(day.id) && styles.selectedDayButton,
                ]}
                onPress={() => toggleDay(day.id)}
              >
                <Text style={[
                  styles.dayButtonText,
                  selectedSchedule.daysOfWeek?.includes(day.id) && styles.selectedDayButtonText,
                ]}>
                  {day.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.daysSummary}>{formatDays(selectedSchedule.daysOfWeek)}</Text>
        </View>
      )}

      {showTimePicker && (
        <Modal
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <View style={styles.timePickerModal}>
            <View style={styles.timePickerContent}>
              <DateTimePicker
                value={timePickerType === 'start' 
                  ? selectedSchedule.startTime || new Date()
                  : selectedSchedule.endTime || new Date()
                }
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
              />
              <TouchableOpacity
                style={styles.timePickerClose}
                onPress={() => setShowTimePicker(false)}
              >
                <Text style={styles.timePickerCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
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
  optionsContainer: {
    gap: 8,
  },
  scheduleOption: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedScheduleOption: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[200],
  },
  disabledOption: {
    opacity: 0.5,
  },
  scheduleOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[200],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  scheduleTextContainer: {
    flex: 1,
  },
  scheduleOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  scheduleOptionDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
  },
  timePickerContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  timeButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  timeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  timeButtonText: {
    fontSize: 14,
    color: COLORS.text.primary,
    fontWeight: '500',
  },
  daysContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
  },
  daysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary[500],
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
  selectedDayButtonText: {
    color: '#fff',
  },
  daysSummary: {
    fontSize: 12,
    color: COLORS.gray[600],
    textAlign: 'center',
  },
  timePickerModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  timePickerContent: {
    backgroundColor: COLORS.background.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
  },
  timePickerClose: {
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.primary[500],
    borderRadius: 12,
    alignItems: 'center',
  },
  timePickerCloseText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});