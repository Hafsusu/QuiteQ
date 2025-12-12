import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { MODE_LIST, ModeType } from '@/constants/modes';
import { useModeStore, ActiveMode } from '@/store/modeStore';
import { ModeCard } from '@/components/modes/ModeCard';
import { ModeModal } from '@/components/modes/ModeModal';
import { ScheduleConfig } from '@/components/modes/SchedulePicker';

export const ModesScreen = () => {
  const { 
    activeModes, 
    activateMode, 
    deactivateMode, 
    deactivateAllModes,
    updateModeSettings,
  } = useModeStore();
  
  const [selectedMode, setSelectedMode] = useState<ModeType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getActiveMode = (modeType: ModeType): ActiveMode | undefined => {
    return activeModes.find(m => m.type === modeType);
  };

  const handleModePress = (modeType: ModeType) => {
    setSelectedMode(modeType);
    setIsModalVisible(true);
  };

  const handleToggleMode = (modeType: ModeType) => {
    const activeMode = getActiveMode(modeType);
    const modeConfig = MODE_LIST.find(m => m.type === modeType);
    
    if (!modeConfig) return;
    
    if (activeMode) {
      deactivateMode(activeMode.id);
      Alert.alert('Mode Deactivated', `${modeConfig.name} has been deactivated.`);
    } else {
      activateMode(modeType, modeConfig.defaultDuration, {
        autoSilence: modeConfig.autoSilence,
        autoReply: modeConfig.autoReply,
        customMessage: modeConfig.defaultMessage,
        vibrateOnly: false,
        replyToContactsOnly: false,
      });
      Alert.alert('Mode Activated', `${modeConfig.name} has been activated.`);
    }
  };

  const handleSaveMode = (settings: {
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
  }) => {
    if (!selectedMode) return;
    
    const modeConfig = MODE_LIST.find(m => m.type === selectedMode);
    if (!modeConfig) return;

    const activeMode = getActiveMode(selectedMode);
    
    if (activeMode) {
      updateModeSettings(activeMode.id, {
        ...settings.settings,
        customMessage: settings.customMessage,
      });
      Alert.alert('Settings Updated', `${modeConfig.name} settings have been updated.`);
    } else {
      activateMode(selectedMode, settings.duration, {
        ...settings.settings,
        customMessage: settings.customMessage,
      });
      Alert.alert('Mode Activated', `${modeConfig.name} has been activated for ${settings.duration} minutes.`);
    }
    
    setIsModalVisible(false);
  };

  const handleDeactivateAll = () => {
    Alert.alert(
      'Deactivate All Modes',
      'Are you sure you want to deactivate all active modes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Deactivate All', 
          style: 'destructive',
          onPress: () => {
            deactivateAllModes();
            Alert.alert('All Modes Deactivated', 'All active modes have been deactivated.');
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Modes & Settings</Text>
            <Text style={styles.headerSubtitle}>
              Configure your quiet moments
            </Text>
          </View>
          {activeModes.length > 0 && (
            <TouchableOpacity 
              style={styles.deactivateAllButton}
              onPress={handleDeactivateAll}
            >
              <Icon name="stop-circle" size={24} color={COLORS.error[500]} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeModes.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{MODE_LIST.length}</Text>
            <Text style={styles.statLabel}>Total Modes</Text>
          </View>
          <View style={styles.statCard}>
            <TouchableOpacity style={styles.historyButton}>
              <Icon name="history" size={24} color={COLORS.primary[500]} />
              <Text style={styles.statLabel}>History</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Modes</Text>
          <Text style={styles.sectionSubtitle}>
            Tap to configure, long press to toggle
          </Text>
        </View>

        <View style={styles.modesList}>
          {MODE_LIST.map((mode) => {
            const isActive = activeModes.some(m => m.type === mode.type);
            const activeMode = getActiveMode(mode.type);
            
            return (
              <ModeCard
                key={mode.id}
                mode={mode}
                isActive={isActive}
                activeMode={activeMode}
                onPress={() => handleModePress(mode.type)}
                onToggle={() => handleToggleMode(mode.type)}
              />
            );
          })}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Coming Soon', 'Scheduling feature will be available soon.')}
            >
              <Icon name="calendar-clock" size={20} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>Schedule All</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Coming Soon', 'Bulk message editing coming soon.')}
            >
              <Icon name="message-text" size={20} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>Edit Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => Alert.alert('Coming Soon', 'Location management coming soon.')}
            >
              <Icon name="map-marker-radius" size={20} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>Set Locations</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <ModeModal
        visible={isModalVisible}
        selectedMode={selectedMode}
        activeMode={selectedMode ? getActiveMode(selectedMode) : undefined}
        onClose={() => setIsModalVisible(false)}
        onSave={handleSaveMode}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary[900],
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.primary[100],
    marginTop: 4,
  },
  deactivateAllButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    marginTop: -16,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface.light,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary[600],
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
  historyButton: {
    alignItems: 'center',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.text.primary,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: COLORS.text.secondary,
    marginTop: 4,
  },
  modesList: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  quickActions: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.gray[50],
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 12,
    marginHorizontal: 4,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 12,
    color: COLORS.primary[600],
    fontWeight: '600',
  },
});