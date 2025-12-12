import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { ActiveMode } from '@/store/modeStore';

interface ActiveModesBannerProps {
  activeModes: ActiveMode[];
  onStopAll: () => void;
}

export const ActiveModesBanner: React.FC<ActiveModesBannerProps> = ({ 
  activeModes, 
  onStopAll 
}) => {
  if (activeModes.length === 0) return null;

  const getModeIcon = (type: string) => {
    switch (type) {
      case 'prayer': return 'mosque';
      case 'meeting': return 'account-group';
      case 'nap': return 'sleep';
      case 'study': return 'book-education';
      default: return 'cog';
    }
  };

  return (
    <View style={{
      marginHorizontal: 20,
      marginTop: -16,
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 16,
      borderWidth: 0,
      // borderColor: COLORS.primary[900],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.02,
      shadowRadius: 4,
      elevation: 2,
    }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '700', 
            color: COLORS.primary[900],
          }}>
            Active Mode{activeModes.length > 1 ? 's' : ''}
          </Text>
          <Text style={{ 
            fontSize: 14, 
            color: COLORS.primary[900], 
            marginTop: 2,
          }}>
            {activeModes.length} mode{activeModes.length > 1 ? 's' : ''} running
          </Text>
        </View>
        <TouchableOpacity
          onPress={onStopAll}
          style={{
            backgroundColor: COLORS.error[500],
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Icon name="stop" size={16} color="#fff" style={{ marginRight: 6 }} />
          <Text style={{ 
            color: '#fff', 
            fontWeight: '600', 
            fontSize: 14,
          }}>
            Stop All
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 8 }}
      >
        {activeModes.map((mode) => (
          <View 
            key={mode.id} 
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: COLORS.primary[900],
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              marginRight: 8,
              borderWidth: 1,
              borderColor: COLORS.primary[900],
            }}
          >
            <Icon 
              name={getModeIcon(mode.type)}
              size={14}
              color={COLORS.primary[100]}
            />
            <Text style={{ 
              fontSize: 12, 
              fontWeight: '600', 
              color: COLORS.primary[100],
              marginLeft: 6,
            }}>
              {mode.type.charAt(0).toUpperCase() + mode.type.slice(1)}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};