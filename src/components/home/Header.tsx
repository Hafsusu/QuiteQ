import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

interface HeaderProps {
  title: string;
  subtitle: string;
  onStatsPress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title, 
  subtitle, 
  onStatsPress 
}) => {
  return (
    <View style={{ 
      backgroundColor: COLORS.primary[900], 
      paddingHorizontal: 24, 
      paddingTop: 24, 
      paddingBottom: 32,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 5,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{ 
          fontSize: 32, 
          fontWeight: '700', 
          color: 'white',
          letterSpacing: -0.5,
        }}>
          {title}
        </Text>
        <Text style={{ 
          fontSize: 16, 
          color: COLORS.primary[100], 
          marginTop: 4,
          fontWeight: '500',
        }}>
          {subtitle}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={onStatsPress}
        style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          justifyContent: 'center',
          alignItems: 'center',
          marginLeft: 16,
        }}
      >
        <Icon name="chart-box" size={24} color={COLORS.primary[100]} />
      </TouchableOpacity>
    </View>
  );
};