import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { ModeHistory } from '@/store/modeStore';

interface ActivityListProps {
  activities: ModeHistory[];
}

export const ActivityList: React.FC<ActivityListProps> = ({ activities }) => {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'Today';
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'long' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDuration = (startTime: Date, endTime?: Date) => {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    const minutes = Math.round((end.getTime() - start.getTime()) / 60000);
    
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 
        ? `${hours}h ${remainingMinutes}m` 
        : `${hours}h`;
    }
  };

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

  const groupedActivities = activities.reduce((groups, activity) => {
    const date = formatDate(activity.startTime);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
    return groups;
  }, {} as Record<string, ModeHistory[]>);

  if (activities.length === 0) {
    return null;
  }

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <Text style={{ 
        fontSize: 22, 
        fontWeight: '700', 
        color: COLORS.text.primary,
        marginBottom: 16,
      }}>
        Recent Activity
      </Text>

      <ScrollView style={{ maxHeight: 400 }}>
        {Object.entries(groupedActivities).map(([date, dateActivities]) => (
          <View key={date} style={{ marginBottom: 24 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: COLORS.text.primary,
              marginBottom: 12,
            }}>
              {date}
            </Text>
            
            {dateActivities.map((activity, _index) => (
              <View 
                key={activity.id}
                style={{
                  backgroundColor: '#fff',
                  borderRadius: 12,
                  padding: 16,
                  marginBottom: 8,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  elevation: 1,
                  borderWidth: 1,
                  borderColor: '#F3F4F6',
                  borderLeftWidth: 4,
                  borderLeftColor: getModeColor(activity.type),
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    <View style={{
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      backgroundColor: getModeColor(activity.type) + '20',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12,
                    }}>
                      <Icon 
                        name={getModeIcon(activity.type)} 
                        size={20} 
                        color={getModeColor(activity.type)} 
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 16, fontWeight: '600', color: COLORS.text.primary }}>
                        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Mode
                      </Text>
                      <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>
                        {formatTime(activity.startTime)} • {formatDuration(activity.startTime, activity.endTime)}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: activity.endTime ? COLORS.success[500] : COLORS.primary[100],
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginBottom: 4,
                    }}>
                      <Icon 
                        name={activity.endTime ? 'check-circle' : 'play-circle'} 
                        size={12} 
                        color={activity.endTime ? COLORS.success[600] : COLORS.primary[600]} 
                        style={{ marginRight: 4 }}
                      />
                      <Text style={{ 
                        fontSize: 11, 
                        fontWeight: '600',
                        color: activity.endTime ? COLORS.success[600] : COLORS.primary[800],
                      }}>
                        {activity.endTime ? 'Completed' : 'Active'}
                      </Text>
                    </View>
                    
                    {activity.settings?.autoSilence && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                        <Icon name="volume-off" size={12} color={COLORS.gray[500]} style={{ marginRight: 4 }} />
                        <Text style={{ fontSize: 11, color: COLORS.text.secondary }}>
                          Silenced
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
                
                {activity.settings?.customMessage && (
                  <View style={{ 
                    backgroundColor: COLORS.gray[50], 
                    borderRadius: 8, 
                    padding: 8, 
                    marginTop: 8,
                  }}>
                    <Text style={{ fontSize: 12, color: COLORS.text.secondary, fontStyle: 'italic' }}>
                      "{activity.settings.customMessage.substring(0, 100)}"
                    </Text>
                  </View>
                )}
                
                {activity.endTime && (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                    <Text style={{ fontSize: 11, color: COLORS.text.secondary }}>
                      Started: {formatTime(activity.startTime)}
                    </Text>
                    <Text style={{ fontSize: 11, color: COLORS.text.secondary }}>
                      Ended: {formatTime(activity.endTime)}
                    </Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};