import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

interface ActivityHeaderProps {
  activityCount: number;
}

export const ActivityHeader: React.FC<ActivityHeaderProps> = ({ activityCount }) => {
  return (
    <View style={{
      backgroundColor: COLORS.primary[900],
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 32,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ 
            fontSize: 32, 
            fontWeight: '700', 
            color: COLORS.primary[100],
            letterSpacing: -0.5,
          }}>
            Activity History
          </Text>
          <Text style={{ 
            fontSize: 16, 
            color: COLORS.primary[300], 
            marginTop: 4,
            fontWeight: '500',
          }}>
            {activityCount} session{activityCount !== 1 ? 's' : ''} recorded
          </Text>
        </View>
        <TouchableOpacity style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 16,
        }}>
          <Icon name="export" size={24} color={COLORS.primary[100]} />
        </TouchableOpacity>
      </View>
    </View>
  );
};