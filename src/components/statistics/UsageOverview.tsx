import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

interface UsageOverviewProps {
  stats: {
    totalModesUsed: number;
    totalTimeInModes: number;
    hoursSaved: number;
    averageSession: number;
    currentActive: number;
  };
}

export const UsageOverview: React.FC<UsageOverviewProps> = ({ stats }) => {
  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    return `${hours}h ${minutes}m`;
  };

  const statCards = [
    {
      title: 'Total Modes',
      value: stats.totalModesUsed.toString(),
      icon: 'play-circle',
      color: COLORS.primary[500],
      bgColor: `${COLORS.primary[500]}20`,
    },
    {
      title: 'Time Focused',
      value: formatTime(stats.totalTimeInModes),
      icon: 'clock',
      color: COLORS.success[500],
      bgColor: `${COLORS.success[500]}20`,
    },
    {
      title: 'Hours Saved',
      value: stats.hoursSaved.toString(),
      icon: 'timer-sand',
      color: '#8B5CF6',
      bgColor: '#8B5CF620',
    },
    {
      title: 'Avg Session',
      value: `${stats.averageSession}m`,
      icon: 'chart-timeline',
      color: '#F59E0B',
      bgColor: '#F59E0B20',
    },
  ];

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <Text style={{ 
        fontSize: 22, 
        fontWeight: '700', 
        color: COLORS.text.primary,
        marginBottom: 16,
      }}>
        Usage Overview
      </Text>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {statCards.map((card, index) => (
          <View 
            key={index}
            style={{
              width: '48%',
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              marginBottom: 12,
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
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: card.bgColor,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <Icon name={card.icon} size={20} color={card.color} />
            </View>
            <Text style={{ 
              fontSize: 24, 
              fontWeight: '700', 
              color: COLORS.text.primary,
              marginBottom: 4,
            }}>
              {card.value}
            </Text>
            <Text style={{ 
              fontSize: 13, 
              color: COLORS.text.secondary,
            }}>
              {card.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};