import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { MODE_LIST, ModeConfig, ModeType } from '@/constants/modes';
import { useModeStore } from '@/store/modeStore';

export const ModesScreen = () => {
  const { activeModes, } = useModeStore();
  const [selectedMode, setSelectedMode] = useState<ModeType | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [scheduleType, setScheduleType] = useState<'manual' | 'scheduled' | 'geofence'>('manual');

  const getModeStatus = (modeType: ModeType) => {
    return activeModes.some(mode => mode.type === modeType) ? 'active' : 'inactive';
  };

  const handleModePress = (mode: ModeConfig) => {
    setSelectedMode(mode.type);
    setIsModalVisible(true);
  };

  const renderModeCard = (mode: ModeConfig) => {
    const isActive = getModeStatus(mode.type) === 'active';
    const activeMode = activeModes.find(m => m.type === mode.type);

    return (
      <TouchableOpacity
        key={mode.id}
        style={[
          styles.modeCard,
          { borderLeftColor: mode.color },
          isActive && styles.activeModeCard,
        ]}
        onPress={() => handleModePress(mode)}
        activeOpacity={0.7}
      >
        <View style={styles.modeHeader}>
          <View style={[styles.modeIconContainer, { backgroundColor: `${mode.color}20` }]}>
            <Icon 
              name={
                mode.type === 'prayer' ? 'mosque' :
                mode.type === 'meeting' ? 'account-group' :
                mode.type === 'nap' ? 'sleep' :
                mode.type === 'study' ? 'book-education' : 'cog'
              }
              size={24}
              color={mode.color}
            />
          </View>
          <View style={styles.modeTitleContainer}>
            <Text style={styles.modeName}>{mode.name}</Text>
            <View style={styles.statusBadge}>
              <View 
                style={[
                  styles.statusDot,
                  { backgroundColor: isActive ? COLORS.success[500] : COLORS.gray[400] }
                ]} 
              />
              <Text style={styles.statusText}>
                {isActive ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
          <Icon name="chevron-right" size={20} color={COLORS.gray[400]} />
        </View>

        <Text style={styles.modeDescription}>
          {mode.defaultMessage}
        </Text>

        <View style={styles.modeFeatures}>
          <View style={styles.featureTag}>
            <Icon name="volume-off" size={14} color={COLORS.gray[600]} />
            <Text style={styles.featureText}>Auto-silence</Text>
          </View>
          <View style={styles.featureTag}>
            <Icon name="message-reply" size={14} color={COLORS.gray[600]} />
            <Text style={styles.featureText}>Auto-reply</Text>
          </View>
          {mode.canSchedule && (
            <View style={styles.featureTag}>
              <Icon name="clock" size={14} color={COLORS.gray[600]} />
              <Text style={styles.featureText}>Scheduling</Text>
            </View>
          )}
          {mode.canGeofence && (
            <View style={styles.featureTag}>
              <Icon name="map-marker" size={14} color={COLORS.gray[600]} />
              <Text style={styles.featureText}>Location-based</Text>
            </View>
          )}
        </View>

        {isActive && activeMode && (
          <View style={styles.activeInfo}>
            <Text style={styles.activeInfoText}>
              Active for {Math.round((new Date().getTime() - new Date(activeMode.startTime).getTime()) / 60000)} min
            </Text>
            {activeMode.endTime && (
              <Text style={styles.activeInfoSubtext}>
                Ends at {activeMode.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderScheduleOption = (type: 'manual' | 'scheduled' | 'geofence', icon: string, title: string, description: string) => (
    <TouchableOpacity
      style={[
        styles.scheduleOption,
        scheduleType === type && styles.selectedScheduleOption,
      ]}
      onPress={() => setScheduleType(type)}
    >
      <View style={styles.scheduleOptionHeader}>
        <View style={[
          styles.scheduleIconContainer,
          scheduleType === type && { backgroundColor: COLORS.primary[100] }
        ]}>
          <Icon 
            name={icon} 
            size={20} 
            color={scheduleType === type ? COLORS.primary[600] : COLORS.gray[500]} 
          />
        </View>
        <Text style={[
          styles.scheduleOptionTitle,
          scheduleType === type && { color: COLORS.primary[600] }
        ]}>
          {title}
        </Text>
      </View>
      <Text style={styles.scheduleOptionDescription}>{description}</Text>
    </TouchableOpacity>
  );

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
          <TouchableOpacity style={styles.addButton}>
            <Icon name="plus" size={24} color="#fff" />
          </TouchableOpacity>
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
            <Icon name="history" size={24} color={COLORS.primary[500]} />
            <Text style={styles.statLabel}>History</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Modes</Text>
          <Text style={styles.sectionSubtitle}>
            Tap to configure or activate
          </Text>
        </View>

        <View style={styles.modesList}>
          {MODE_LIST.map(renderModeCard)}
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="calendar-clock" size={20} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>Schedule All</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="message-text" size={20} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>Edit Messages</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Icon name="map-marker-radius" size={20} color={COLORS.primary[600]} />
              <Text style={styles.actionButtonText}>Set Locations</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMode && (
              <>
                <View style={styles.modalHeader}>
                  <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                    <Icon name="close" size={24} color={COLORS.gray[500]} />
                  </TouchableOpacity>
                  <Text style={styles.modalTitle}>
                    {MODE_LIST.find(m => m.type === selectedMode)?.name}
                  </Text>
                  <View style={{ width: 24 }} />
                </View>

                <ScrollView style={styles.modalBody}>
                  {/* Custom Message */}
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

                  <View style={styles.settingSection}>
                    <Text style={styles.settingTitle}>Activation Method</Text>
                    {renderScheduleOption('manual', 'power', 'Manual', 'Activate manually when needed')}
                    {renderScheduleOption('scheduled', 'clock', 'Scheduled', 'Set specific times automatically')}
                    {renderScheduleOption('geofence', 'map-marker', 'Location', 'Activate when entering locations')}
                  </View>

                  <View style={styles.settingSection}>
                    <Text style={styles.settingTitle}>Settings</Text>
                    <View style={styles.settingRow}>
                      <View>
                        <Text style={styles.settingLabel}>Auto Silence</Text>
                        <Text style={styles.settingDescription}>Silence phone when active</Text>
                      </View>
                      <Switch
                        value={true}
                        onValueChange={() => {}}
                        trackColor={{ false: COLORS.gray[300], true: COLORS.primary[500] }}
                      />
                    </View>
                    <View style={styles.settingRow}>
                      <View>
                        <Text style={styles.settingLabel}>Auto Reply</Text>
                        <Text style={styles.settingDescription}>Send auto-reply to callers</Text>
                      </View>
                      <Switch
                        value={true}
                        onValueChange={() => {}}
                        trackColor={{ false: COLORS.gray[300], true: COLORS.primary[500] }}
                      />
                    </View>
                    <View style={styles.settingRow}>
                      <View>
                        <Text style={styles.settingLabel}>Vibrate Only</Text>
                        <Text style={styles.settingDescription}>Vibrate instead of complete silence</Text>
                      </View>
                      <Switch
                        value={false}
                        onValueChange={() => {}}
                        trackColor={{ false: COLORS.gray[300], true: COLORS.primary[500] }}
                      />
                    </View>
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <TouchableOpacity 
                    style={styles.secondaryButton}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <Text style={styles.secondaryButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.primaryButton}>
                    <Text style={styles.primaryButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  modeCard: {
    backgroundColor: COLORS.surface.light,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  activeModeCard: {
    backgroundColor: COLORS.primary[50],
    borderLeftWidth: 4,
  },
  modeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  modeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  modeTitleContainer: {
    flex: 1,
  },
  modeName: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
    marginBottom: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: COLORS.gray[600],
    fontWeight: '500',
  },
  modeDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  modeFeatures: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  activeInfo: {
    backgroundColor: 'rgba(45, 116, 210, 0.05)',
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  activeInfoText: {
    fontSize: 12,
    color: COLORS.primary[700],
    fontWeight: '600',
  },
  activeInfoSubtext: {
    fontSize: 11,
    color: COLORS.primary[600],
    marginTop: 2,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background.light,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
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
  scheduleOption: {
    backgroundColor: COLORS.gray[50],
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedScheduleOption: {
    backgroundColor: COLORS.primary[50],
    borderColor: COLORS.primary[200],
  },
  scheduleOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
  scheduleOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  scheduleOptionDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
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