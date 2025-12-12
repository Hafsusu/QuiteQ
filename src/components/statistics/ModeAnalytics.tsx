import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { ModeHistory } from '@/store/modeStore';

interface ModeAnalyticsProps {
  modeHistory: ModeHistory[];
}

export const ModeAnalytics: React.FC<ModeAnalyticsProps> = ({ modeHistory }) => {
  const modeStats = modeHistory.reduce((acc, history) => {
    const duration = history.endTime 
      ? new Date(history.endTime).getTime() - new Date(history.startTime).getTime()
      : 0;
    
    if (!acc[history.type]) {
      acc[history.type] = {
        count: 0,
        totalDuration: 0,
        color: getModeColor(history.type),
        icon: getModeIcon(history.type),
      };
    }
    
    acc[history.type].count++;
    acc[history.type].totalDuration += duration;
    return acc;
  }, {} as Record<string, { count: number; totalDuration: number; color: string; icon: string }>);

  const totalDuration = Object.values(modeStats).reduce((sum, stat) => sum + stat.totalDuration, 0);

  const getModeColor = (type: string) => {
    switch (type) {
      case 'prayer': return '#8B5CF6';
      case 'meeting': return '#10B981';
      case 'nap': return '#F59E0B';
      case 'study': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const getModeIcon = (type: string) => {
    switch (type) {
      case 'prayer': return 'mosque';
      case 'meeting': return 'account-group';
      case 'nap': return 'sleep';
      case 'study': return 'book-education';
      default: return 'cog';
    }
  };

  const modeEntries = Object.entries(modeStats).sort((a, b) => b[1].totalDuration - a[1].totalDuration);

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <Text style={{ 
        fontSize: 22, 
        fontWeight: '700', 
        color: COLORS.text.primary,
        marginBottom: 16,
      }}>
        Mode Analytics
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
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', paddingRight: 20 }}>
            {modeEntries.map(([type, stats], _index) => {
              const percentage = totalDuration > 0 ? (stats.totalDuration / totalDuration) * 100 : 0;
              
              return (
                <View 
                  key={type}
                  style={{
                    width: 140,
                    marginRight: 12,
                    alignItems: 'center',
                  }}
                >
                  <View style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: `${stats.color}20`,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}>
                    <Icon name={stats.icon} size={24} color={stats.color} />
                  </View>
                  <Text style={{ 
                    fontSize: 14, 
                    fontWeight: '600', 
                    color: COLORS.text.primary,
                    textAlign: 'center',
                    marginBottom: 4,
                  }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                  <Text style={{ 
                    fontSize: 12, 
                    color: COLORS.text.secondary,
                    marginBottom: 4,
                  }}>
                    {stats.count} sessions
                  </Text>
                  <View style={{
                    width: '100%',
                    height: 4,
                    backgroundColor: COLORS.gray[200],
                    borderRadius: 2,
                    overflow: 'hidden',
                  }}>
                    <View 
                      style={{
                        width: `${percentage}%`,
                        height: '100%',
                        backgroundColor: stats.color,
                        borderRadius: 2,
                      }}
                    />
                  </View>
                  <Text style={{ 
                    fontSize: 11, 
                    color: COLORS.text.secondary,
                    marginTop: 4,
                  }}>
                    {Math.round(percentage)}% of total time
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
        
        {modeEntries.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: 24 }}>
            <Icon name="chart-line" size={48} color={COLORS.gray[300]} />
            <Text style={{ 
              fontSize: 16, 
              color: COLORS.text.secondary,
              marginTop: 12,
              textAlign: 'center',
            }}>
              No mode data yet. Start using modes to see analytics.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};