import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { ModeConfig } from '@/constants/modes';
import { useModeStore } from '@/store/modeStore';

interface ModeCardProps {
  mode: ModeConfig;
  style?: ViewStyle;
}

export const ModeCard: React.FC<ModeCardProps> = ({ mode, style }) => {
  const { activateMode, activeModes } = useModeStore();
  const isActive = activeModes.some((active) => active.type === mode.type);

  const handlePress = () => {
    if (!isActive) {
      activateMode(mode.type);
    }
  };

  const getIconName = () => {
    switch (mode.type) {
      case 'prayer':
        return 'mosque';
      case 'meeting':
        return 'account-group';
      case 'nap':
        return 'sleep';
      case 'study':
        return 'book-education';
      case 'custom':
        return 'cog';
      default:
        return 'timer';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isActive ? `${mode.color}20` : '#fff' },
        style,
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.iconContainer}>
        <View
          style={[
            styles.iconBackground,
            { backgroundColor: isActive ? mode.color : COLORS.gray[100] },
          ]}
        >
          <Icon
            name={getIconName()}
            size={28}
            color={isActive ? '#fff' : COLORS.gray[600]}
          />
        </View>
      </View>

      <Text style={styles.name}>{mode.name}</Text>
      
      <View style={styles.features}>
        <View style={styles.featureTag}>
          <Icon name="volume-off" size={14} color={COLORS.gray[600]} />
          <Text style={styles.featureText}>Silence</Text>
        </View>
        <View style={styles.featureTag}>
          <Icon name="message-reply" size={14} color={COLORS.gray[600]} />
          <Text style={styles.featureText}>Auto-Reply</Text>
        </View>
      </View>

      <View style={[styles.statusIndicator, isActive && styles.statusActive]}>
        <Text style={styles.statusText}>
          {isActive ? 'ACTIVE' : 'TAP TO ACTIVATE'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.gray[200],
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 12,
  },
  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 8,
  },
  features: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 6,
  },
  featureTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray[50],
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  featureText: {
    fontSize: 12,
    color: COLORS.gray[600],
  },
  statusIndicator: {
    backgroundColor: COLORS.gray[100],
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    width: '100%',
    alignItems: 'center',
  },
  statusActive: {
    backgroundColor: COLORS.success[500],
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.gray[700],
  },
});