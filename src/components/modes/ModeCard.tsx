import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { ModeConfig } from '@/constants/modes';
import { ActiveMode } from '@/store/modeStore';

interface ModeCardProps {
  mode: ModeConfig;
  isActive?: boolean;
  activeMode?: ActiveMode | null;
  onPress: () => void;
  onToggle?: () => void;
}

export const ModeCard: React.FC<ModeCardProps> = ({
  mode,
  isActive = false,
  activeMode = null,
  onPress,
  onToggle,
}) => {
  const getIconName = () => {
    switch (mode.type) {
      case 'prayer': return 'mosque';
      case 'meeting': return 'account-group';
      case 'nap': return 'sleep';
      case 'study': return 'book-education';
      case 'custom': return 'cog';
      default: return 'timer';
    }
  };

  const formatTime = (date?: Date | string) => {
    if (!date) return '';
    const time = typeof date === 'string' ? new Date(date) : date;
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getActiveDuration = () => {
    if (!activeMode?.startTime) return 0;
    const start = typeof activeMode.startTime === 'string' 
      ? new Date(activeMode.startTime) 
      : activeMode.startTime;
    return Math.round((new Date().getTime() - start.getTime()) / 60000);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderLeftColor: mode.color },
        isActive && styles.activeCard,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      onLongPress={onToggle}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: `${mode.color}20` }]}>
          <Icon name={getIconName()} size={24} color={mode.color} />
        </View>
        <View style={styles.titleContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{mode.name}</Text>
            {onToggle && (
              <TouchableOpacity
                style={styles.toggleButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onToggle();
                }}
              >
                <View 
                  style={[
                    styles.toggle,
                    { backgroundColor: isActive ? COLORS.success[500] : COLORS.gray[300] }
                  ]} 
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.statusBadge}>
            <View 
              style={[
                styles.statusDot,
                { backgroundColor: isActive ? COLORS.success[500] : COLORS.gray[400] }
              ]} 
            />
            <Text style={styles.statusText}>
              {isActive ? 'Active' : 'Tap to configure'}
            </Text>
          </View>
        </View>
        <Icon name="chevron-right" size={20} color={COLORS.gray[400]} />
      </View>

      <Text style={styles.description}>
        {isActive && activeMode?.settings?.customMessage 
          ? activeMode.settings.customMessage 
          : mode.defaultMessage
        }
      </Text>

      <View style={styles.features}>
        <View style={[
          styles.featureTag,
          (isActive && activeMode?.settings?.autoSilence) && styles.activeFeatureTag
        ]}>
          <Icon 
            name="volume-off" 
            size={14} 
            color={(isActive && activeMode?.settings?.autoSilence) ? COLORS.primary[600] : COLORS.gray[600]} 
          />
          <Text style={[
            styles.featureText,
            (isActive && activeMode?.settings?.autoSilence) && styles.activeFeatureText
          ]}>
            Auto-silence
          </Text>
        </View>
        <View style={[
          styles.featureTag,
          (isActive && activeMode?.settings?.autoReply) && styles.activeFeatureTag
        ]}>
          <Icon 
            name="message-reply" 
            size={14} 
            color={(isActive && activeMode?.settings?.autoReply) ? COLORS.primary[600] : COLORS.gray[600]} 
          />
          <Text style={[
            styles.featureText,
            (isActive && activeMode?.settings?.autoReply) && styles.activeFeatureText
          ]}>
            Auto-reply
          </Text>
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
            <Text style={styles.featureText}>Location</Text>
          </View>
        )}
      </View>

      {isActive && activeMode && (
        <View style={styles.activeInfo}>
          <Text style={styles.activeInfoText}>
            Active for {getActiveDuration()} min
            {activeMode.endTime && ` • Ends at ${formatTime(activeMode.endTime)}`}
          </Text>
          {activeMode.settings?.vibrateOnly && (
            <Text style={styles.activeInfoSubtext}>⚡ Vibrate mode enabled</Text>
          )}
          {activeMode.settings?.replyToContactsOnly && (
            <Text style={styles.activeInfoSubtext}>👥 Replies to contacts only</Text>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
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
  activeCard: {
    backgroundColor: COLORS.primary[50],
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  titleContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text.primary,
  },
  toggleButton: {
    padding: 4,
  },
  toggle: {
    width: 40,
    height: 24,
    borderRadius: 12,
    position: 'relative',
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
  description: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  features: {
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
  activeFeatureTag: {
    backgroundColor: COLORS.primary[100],
  },
  featureText: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  activeFeatureText: {
    color: COLORS.primary[600],
    fontWeight: '500',
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
});