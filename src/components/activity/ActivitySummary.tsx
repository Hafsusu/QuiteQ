import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { ModeHistory } from '@/store/modeStore';

interface ActivitySummaryProps {
  activities: ModeHistory[];
}

export const ActivitySummary: React.FC<ActivitySummaryProps> = ({ activities }) => {
  const calculateStats = () => {
    const totalSessions = activities.length;
    const totalDuration = activities.reduce((total, activity) => {
      const start = new Date(activity.startTime);
      const end = activity.endTime ? new Date(activity.endTime) : new Date();
      return total + (end.getTime() - start.getTime());
    }, 0);
    
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;
    
    const mostUsedMode = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const topMode = Object.entries(mostUsedMode).sort((a, b) => b[1] - a[1])[0];
    
    return {
      totalSessions,
      totalHours: Math.round(totalDuration / 3600000),
      avgMinutes: Math.round(avgDuration / 60000),
      topMode: topMode ? {
        type: topMode[0],
        count: topMode[1],
        percentage: Math.round((topMode[1] / totalSessions) * 100),
      } : null,
    };
  };

  const stats = calculateStats();
  const getModeColor = (type: string) => {
    switch (type) {
      case 'prayer': return '#8B5CF6';
      case 'meeting': return '#10B981';
      case 'nap': return '#F59E0B';
      case 'study': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  if (activities.length === 0) {
    return (
      <View style={{ paddingHorizontal: 20, marginTop: 24, alignItems: 'center' }}>
        <Icon name="history" size={48} color={COLORS.gray[300]} />
        <Text style={{ 
          fontSize: 16, 
          color: COLORS.text.secondary,
          marginTop: 12,
          textAlign: 'center',
        }}>
          No activity found for the selected filters
        </Text>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <Text style={{ 
        fontSize: 22, 
        fontWeight: '700', 
        color: COLORS.text.primary,
        marginBottom: 16,
      }}>
        Summary
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
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.primary[600] }}>
              {stats.totalSessions}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>
              Sessions
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: COLORS.success[600] }}>
              {stats.totalHours}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>
              Hours
            </Text>
          </View>
          <View style={{ alignItems: 'center', flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: '700', color: '#F59E0B' }}>
              {stats.avgMinutes}
            </Text>
            <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>
              Avg/min
            </Text>
          </View>
        </View>

        {stats.topMode && (
          <View style={{ 
            backgroundColor: COLORS.primary[50], 
            borderRadius: 12, 
            padding: 12,
            borderWidth: 1,
            borderColor: COLORS.primary[100],
          }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary[900], marginBottom: 4 }}>
              Most Used Mode
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: getModeColor(stats.topMode.type) + '40',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: 8,
              }}>
                <Icon 
                  name={stats.topMode.type === 'prayer' ? 'mosque' :
                        stats.topMode.type === 'meeting' ? 'account-group' :
                        stats.topMode.type === 'nap' ? 'sleep' :
                        stats.topMode.type === 'study' ? 'book-education' : 'cog'}
                  size={16} 
                  color={getModeColor(stats.topMode.type)} 
                />
              </View>
              <Text style={{ fontSize: 14, color: COLORS.text.primary, flex: 1 }}>
                {stats.topMode.type.charAt(0).toUpperCase() + stats.topMode.type.slice(1)}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary[600] }}>
                {stats.topMode.count} times ({stats.topMode.percentage}%)
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};