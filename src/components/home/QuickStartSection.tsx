import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { ModeConfig } from '@/constants/modes';

interface QuickStartSectionProps {
  modes: ModeConfig[];
  onModeSelect: (mode: ModeConfig) => void;
}

export const QuickStartSection: React.FC<QuickStartSectionProps> = ({ 
  modes, 
  onModeSelect 
}) => {
  const getIconName = (type: string) => {
    switch (type) {
      case 'prayer': return 'mosque';
      case 'meeting': return 'account-group';
      case 'nap': return 'sleep';
      case 'study': return 'book-education';
      default: return 'cog';
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case 'prayer': return '#245da8';
      case 'meeting': return '#3B82F6';
      case 'nap': return '#F59E0B';
      case 'study': return '#10B981';
      default: return '#6B7280';
    }
  };

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: '700', 
          color: COLORS.text.primary,
        }}>
          Quick Start
        </Text>
        <Text style={{ 
          fontSize: 15, 
          color: COLORS.text.secondary, 
          marginTop: 4,
        }}>
          Select a mode to begin. Your phone will adjust automatically.
        </Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {modes.map((mode) => (
          <TouchableOpacity
            key={mode.id}
            onPress={() => onModeSelect(mode)}
            style={{
              width: 140,
              backgroundColor: '#fff',
              borderRadius: 20,
              padding: 16,
              marginRight: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
              borderWidth: 1,
              borderColor: '#F3F4F6',
            }}
          >
            <View style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: `${getIconColor(mode.type)}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Icon 
                name={getIconName(mode.type)} 
                size={24} 
                color={getIconColor(mode.type)} 
              />
            </View>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: COLORS.text.primary,
              marginBottom: 4,
            }}>
              {mode.name}
            </Text>
            <Text style={{ 
              fontSize: 13, 
              color: COLORS.text.secondary,
              lineHeight: 18,
            }}>
              {mode.defaultDuration + 'mins'}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};