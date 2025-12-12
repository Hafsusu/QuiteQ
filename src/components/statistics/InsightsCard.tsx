import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

interface InsightsCardProps {
  stats: {
    totalModesUsed: number;
    totalTimeInModes: number;
    hoursSaved: number;
    averageSession: number;
    currentActive: number;
  };
}

export const InsightsCard: React.FC<InsightsCardProps> = ({ stats }) => {
  const insights = [
    {
      icon: 'trending-up',
      title: 'Consistency Streak',
      description: 'You\'ve used modes for 7 days in a row!',
      color: COLORS.success[500],
    },
    {
      icon: 'lightbulb-on',
      title: 'Best Time',
      description: 'You\'re most productive between 2-4 PM',
      color: '#F59E0B',
    },
    {
      icon: 'shield-check',
      title: 'Distraction Shield',
      description: `Blocked ${Math.floor(stats.hoursSaved * 3.5)} potential distractions`,
      color: COLORS.primary[600],
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
        Insights
      </Text>
      
      <View style={{
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F3F4F6',
      }}>
        {insights.map((insight, index) => (
          <View 
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: index < insights.length - 1 ? 1 : 0,
              borderBottomColor: COLORS.gray[100],
            }}
          >
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: `${insight.color}20`,
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}>
              <Icon name={insight.icon} size={20} color={insight.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ 
                fontSize: 15, 
                fontWeight: '600', 
                color: COLORS.text.primary,
                marginBottom: 2,
              }}>
                {insight.title}
              </Text>
              <Text style={{ 
                fontSize: 13, 
                color: COLORS.text.secondary,
              }}>
                {insight.description}
              </Text>
            </View>
          </View>
        ))}
        
        <View style={{ 
          backgroundColor: COLORS.primary[50], 
          borderRadius: 12, 
          padding: 12, 
          marginTop: 16,
          borderWidth: 1,
          borderColor: COLORS.primary[100],
        }}>
          <Text style={{ 
            fontSize: 13, 
            fontWeight: '600', 
            color: COLORS.primary[900],
            marginBottom: 4,
          }}>
            💡 Pro Tip
          </Text>
          <Text style={{ 
            fontSize: 12, 
            color: COLORS.primary[700],
          }}>
            Schedule study modes during your peak focus hours to maximize productivity.
          </Text>
        </View>
      </View>
    </View>
  );
};