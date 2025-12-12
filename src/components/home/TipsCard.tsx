import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

interface TipsCardProps {
  tips: string[];
}

export const TipsCard: React.FC<TipsCardProps> = ({ tips }) => {
  return (
    <View style={{
      marginHorizontal: 20,
      marginTop: 24,
      marginBottom: 32,
      backgroundColor: COLORS.primary[50],
      borderRadius: 20,
      padding: 20,
      borderWidth: 1,
      borderColor: COLORS.primary[100],
    }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Icon name="lightbulb-on" size={20} color={COLORS.primary[600]} />
        <Text style={{ 
          fontSize: 18, 
          fontWeight: '700', 
          color: COLORS.primary[900],
          marginLeft: 8,
        }}>
          Quick Tips
        </Text>
      </View>

      {tips.map((tip, index) => (
        <View 
          key={index}
          style={{
            flexDirection: 'row',
            alignItems: 'flex-start',
            marginBottom: 12,
            paddingLeft: 4,
          }}
        >
          <Icon 
            name="check-circle" 
            size={16} 
            color={COLORS.primary[500]} 
            style={{ marginTop: 2 }}
          />
          <Text style={{ 
            fontSize: 14, 
            color: COLORS.text.secondary, 
            marginLeft: 10,
            flex: 1,
            lineHeight: 20,
          }}>
            {tip}
          </Text>
        </View>
      ))}
    </View>
  );
};