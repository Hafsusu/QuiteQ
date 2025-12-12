import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal as RNModal,
  TextInput,
  Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { MODE_LIST, ModeType } from '@/constants/modes';
import { ActiveMode } from '@/store/modeStore';
import { DurationPicker } from './DurationPicker';
import { SchedulePicker, ScheduleConfig } from './SchedulePicker';
import { LocationPicker, SavedLocation } from './LocationPicker';
import { ContactSelector, Contact } from './ContactSelector';
import ContactsService from '@/services/ContactsService';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ModeModalProps {
  visible: boolean;
  selectedMode: ModeType | null;
  activeMode?: ActiveMode;
  onClose: () => void;
  onSave: (settings: {
    customMessage: string;
    duration: number;
    schedule: ScheduleConfig;
    locationId?: string;
    selectedContactIds: string[];
    settings: {
      autoSilence: boolean;
      autoReply: boolean;
      vibrateOnly: boolean;
      replyToContactsOnly: boolean;
    };
  }) => void;
}

export const ModeModal: React.FC<ModeModalProps> = ({
  visible,
  selectedMode,
  activeMode,
  onClose,
  onSave,
}) => {
  const modeConfig = selectedMode ? MODE_LIST.find(m => m.type === selectedMode) : null;
  
  const [customMessage, setCustomMessage] = useState('');
  const [duration, setDuration] = useState(30);
  const [schedule, setSchedule] = useState<ScheduleConfig>({ type: 'manual' });
  const [locationId, setLocationId] = useState<string>();
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [uiSettings, setUiSettings] = useState({
    autoSilence: true,
    autoReply: true,
    vibrateOnly: false,
    replyToContactsOnly: false,
  });

  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    if (activeMode && modeConfig) {
      setCustomMessage(activeMode.settings.customMessage || modeConfig.defaultMessage);
      setDuration(
        activeMode.endTime 
          ? Math.round((new Date(activeMode.endTime).getTime() - new Date(activeMode.startTime).getTime()) / 60000)
          : modeConfig.defaultDuration
      );
      setUiSettings(activeMode.settings);
      // TODO: Load schedule, location, contacts from active mode
    } else if (modeConfig) {
      setCustomMessage(modeConfig.defaultMessage);
      setDuration(modeConfig.defaultDuration);
      setUiSettings({
        autoSilence: modeConfig.autoSilence,
        autoReply: modeConfig.autoReply,
        vibrateOnly: false,
        replyToContactsOnly: false,
      });
      setSchedule({ type: 'manual' });
      setLocationId(undefined);
      setSelectedContactIds([]);
    }
  }, [activeMode, modeConfig]);

  const handleSave = () => {
    if (!selectedMode || !modeConfig) return;

    onSave({
      customMessage: customMessage || modeConfig.defaultMessage,
      duration,
      schedule,
      locationId,
      selectedContactIds,
      settings: uiSettings,
    });
  };

  useEffect(() => {
  loadSavedLocations();
  loadContacts();
}, []);

const loadSavedLocations = async () => {
  try {
    const locations = await AsyncStorage.getItem('saved_locations');
    if (locations) {
      setSavedLocations(JSON.parse(locations));
    }
  } catch (error) {
    console.error('Error loading locations:', error);
  }
};

const loadContacts = async () => {
  try {
    const contactList = await ContactsService.getAllContacts();
    setContacts(contactList);
  } catch (error) {
    console.error('Error loading contacts:', error);
  }
};

  const handleSaveLocation = async (location: Omit<SavedLocation, 'id' | 'timestamp'>) => {
  const newLocation: SavedLocation = {
    ...location,
    id: `loc-${Date.now()}`,
    timestamp: Date.now(),
  };
  
  const updatedLocations = [...savedLocations, newLocation];
  setSavedLocations(updatedLocations);
  
  await AsyncStorage.setItem('saved_locations', JSON.stringify(updatedLocations));
  
  setLocationId(newLocation.id);
};
  if (!modeConfig) return null;

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={COLORS.gray[500]} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>{modeConfig.name}</Text>
            <View style={{ width: 24 }} />
          </View>

          <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <DurationPicker
              selectedDuration={duration}
              defaultDuration={modeConfig.defaultDuration}
              onDurationChange={setDuration}
            />

            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Auto-Reply Message</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter custom message..."
                placeholderTextColor={COLORS.gray[400]}
                multiline
                numberOfLines={3}
                value={customMessage}
                onChangeText={setCustomMessage}
              />
            </View>

            <SchedulePicker
              selectedSchedule={schedule}
              onScheduleChange={setSchedule}
              modeCanSchedule={modeConfig.canSchedule}
              modeCanGeofence={modeConfig.canGeofence}
            />

            {schedule.type === 'geofence' && (
              <LocationPicker
                selectedLocationId={locationId}
                savedLocations={savedLocations}
                onLocationSelect={setLocationId}
                onSaveLocation={handleSaveLocation}
              />
            )}

            <ContactSelector
              selectedContactIds={selectedContactIds}
              onContactsChange={setSelectedContactIds}
              modeName={modeConfig.name}
            />

            <View style={styles.settingSection}>
              <Text style={styles.settingTitle}>Settings</Text>
              
              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Auto Silence</Text>
                  <Text style={styles.settingDescription}>Silence phone when active</Text>
                </View>
                <Switch
                  value={uiSettings.autoSilence}
                  onValueChange={(value) => setUiSettings(prev => ({ ...prev, autoSilence: value }))}
                  trackColor={{ false: COLORS.gray[300], true: COLORS.primary[500] }}
                />
              </View>

              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Auto Reply</Text>
                  <Text style={styles.settingDescription}>Send auto-reply to callers</Text>
                </View>
                <Switch
                  value={uiSettings.autoReply}
                  onValueChange={(value) => setUiSettings(prev => ({ ...prev, autoReply: value }))}
                  trackColor={{ false: COLORS.gray[300], true: COLORS.primary[500] }}
                />
              </View>

              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Vibrate Only</Text>
                  <Text style={styles.settingDescription}>Vibrate instead of complete silence</Text>
                </View>
                <Switch
                  value={uiSettings.vibrateOnly}
                  onValueChange={(value) => setUiSettings(prev => ({ ...prev, vibrateOnly: value }))}
                  trackColor={{ false: COLORS.gray[300], true: COLORS.primary[500] }}
                />
              </View>

              <View style={styles.settingRow}>
                <View>
                  <Text style={styles.settingLabel}>Contacts Only</Text>
                  <Text style={styles.settingDescription}>Only reply to selected contacts</Text>
                </View>
                <Switch
                  value={uiSettings.replyToContactsOnly}
                  onValueChange={(value) => setUiSettings(prev => ({ ...prev, replyToContactsOnly: value }))}
                  trackColor={{ false: COLORS.gray[300], true: COLORS.primary[500] }}
                />
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={styles.secondaryButton}
              onPress={onClose}
            >
              <Text style={styles.secondaryButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.primaryButton}
              onPress={handleSave}
            >
              <Text style={styles.primaryButtonText}>
                {activeMode ? 'Update Mode' : 'Activate Mode'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </RNModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  modalBody: {
    padding: 20,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: COLORS.text.primary,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray[200],
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray[200],
    gap: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: COLORS.primary[500],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: COLORS.gray[100],
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: COLORS.gray[700],
    fontSize: 16,
    fontWeight: '600',
  },
});