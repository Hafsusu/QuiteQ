import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

interface ActivityFiltersProps {
  currentFilter: 'all' | 'today' | 'week' | 'month';
  onFilterChange: (filter: 'all' | 'today' | 'week' | 'month') => void;
  selectedMode: string;
  onModeChange: (mode: string) => void;
}

export const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  currentFilter,
  onFilterChange,
  selectedMode,
  onModeChange,
}) => {
  const timeFilters = [
    { value: 'all' as const, label: 'All Time' },
    { value: 'month' as const, label: 'This Month' },
    { value: 'week' as const, label: 'This Week' },
    { value: 'today' as const, label: 'Today' },
  ];

  const modeTypes = [
    { value: 'all', label: 'All Modes', icon: 'view-grid' },
    { value: 'prayer', label: 'Prayer', icon: 'mosque', color: '#8B5CF6' },
    { value: 'meeting', label: 'Meeting', icon: 'account-group', color: '#10B981' },
    { value: 'nap', label: 'Nap', icon: 'sleep', color: '#F59E0B' },
    { value: 'study', label: 'Study', icon: 'book-education', color: '#3B82F6' },
  ];

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <View style={{ marginBottom: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 }}>
          Time Range
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row' }}>
            {timeFilters.map((filterItem) => (
              <TouchableOpacity
                key={filterItem.value}
                onPress={() => onFilterChange(filterItem.value)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: currentFilter === filterItem.value 
                    ? COLORS.primary[600] 
                    : COLORS.gray[200],
                  marginRight: 8,
                }}
              >
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '600',
                  color: currentFilter === filterItem.value ? '#fff' : COLORS.text.primary,
                }}>
                  {filterItem.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View>
        <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 }}>
          Mode Type
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', paddingRight: 20 }}>
            {modeTypes.map((mode) => (
              <TouchableOpacity
                key={mode.value}
                onPress={() => onModeChange(mode.value)}
                style={{
                  alignItems: 'center',
                  marginRight: 12,
                }}
              >
                <View style={{
                  width: 56,
                  height: 56,
                  borderRadius: 28,
                  backgroundColor: selectedMode === mode.value 
                    ? (mode.color || COLORS.primary[600]) + '40' 
                    : COLORS.gray[200],
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderWidth: selectedMode === mode.value ? 2 : 0,
                  borderColor: mode.color || COLORS.primary[600],
                  marginBottom: 6,
                }}>
                  <Icon 
                    name={mode.icon} 
                    size={24} 
                    color={selectedMode === mode.value 
                      ? (mode.color || COLORS.primary[600]) 
                      : COLORS.gray[600]
                    } 
                  />
                </View>
                <Text style={{ 
                  fontSize: 12, 
                  fontWeight: selectedMode === mode.value ? '600' : '400',
                  color: selectedMode === mode.value 
                    ? (mode.color || COLORS.primary[600])
                    : COLORS.text.secondary,
                }}>
                  {mode.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};