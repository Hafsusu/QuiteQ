import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { useModeStore } from '@/store/modeStore';

interface RecentActivityProps {
  onSeeAll?: () => void;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ 
  onSeeAll 
}) => {
  const { modeHistory } = useModeStore();
  
  const recentActivities = [...modeHistory]
    .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
    .slice(0, 3);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activityDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (activityDate.getTime() === today.getTime()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (activityDate.getTime() === yesterday.getTime()) {
      return 'Yesterday';
    }
    
    return activityDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

  const getModeColor = (type: string) => {
    switch (type) {
      case 'prayer': return '#8B5CF6';
      case 'meeting': return '#10B981';
      case 'nap': return '#F59E0B';
      case 'study': return '#3B82F6';
      default: return '#6B7280';
    }
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    } else {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
  };

  if (recentActivities.length === 0) {
    return (
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={{ 
          flexDirection: 'row', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{ 
            fontSize: 24, 
            fontWeight: '700', 
            color: COLORS.text.primary,
          }}>
            Recent Activity
          </Text>
          <TouchableOpacity onPress={onSeeAll}>
            <Text style={{ 
              fontSize: 15, 
              color: COLORS.primary[600], 
              fontWeight: '600',
            }}>
              See All
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}>
          <View style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            backgroundColor: COLORS.gray[100],
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 12,
          }}>
            <Icon name="history" size={24} color={COLORS.gray[500]} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              fontSize: 16, 
              fontWeight: '600', 
              color: COLORS.text.primary,
              marginBottom: 2,
            }}>
              No recent activity
            </Text>
            <Text style={{ 
              fontSize: 14, 
              color: COLORS.text.secondary,
            }}>
              Activate a mode to see your activity history here
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 16,
      }}>
        <Text style={{ 
          fontSize: 24, 
          fontWeight: '700', 
          color: COLORS.text.primary,
        }}>
          Recent Activity
        </Text>
        <TouchableOpacity onPress={onSeeAll}>
          <Text style={{ 
            fontSize: 15, 
            color: COLORS.primary[600], 
            fontWeight: '600',
          }}>
            See All
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={{ marginHorizontal: -20 }}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {recentActivities.map((activity, _index) => (
          <View 
            key={activity.id}
            style={{
              width: 280,
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 16,
              marginRight: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 2,
              elevation: 1,
              borderWidth: 1,
              borderColor: '#F3F4F6',
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: `${getModeColor(activity.type)}20`,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: 12,
                }}>
                  <Icon name={getModeIcon(activity.type)} size={20} color={getModeColor(activity.type)} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ 
                    fontSize: 16, 
                    fontWeight: '600', 
                    color: COLORS.text.primary,
                  }}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} Mode
                  </Text>
                  <Text style={{ 
                    fontSize: 13, 
                    color: COLORS.text.secondary,
                    marginTop: 2,
                  }}>
                    {formatDate(new Date(activity.startTime))} • {formatDuration(activity.duration)}
                  </Text>
                </View>
              </View>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: activity.endTime ? COLORS.success[500] : COLORS.primary[100],
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
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
            </View>

            {activity.settings?.customMessage && (
              <Text style={{ 
                fontSize: 13, 
                color: COLORS.text.secondary,
                fontStyle: 'italic',
                marginBottom: 12,
                lineHeight: 18,
              }}>
                "{activity.settings.customMessage.substring(0, 80)}{activity.settings.customMessage.length > 80 ? '...' : ''}"
              </Text>
            )}

            <View style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              borderTopWidth: 1, 
              borderTopColor: COLORS.gray[100], 
              paddingTop: 12 
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon 
                  name="clock-outline" 
                  size={14} 
                  color={COLORS.gray[500]} 
                  style={{ marginRight: 4 }}
                />
                <Text style={{ fontSize: 12, color: COLORS.text.secondary }}>
                  {formatTime(new Date(activity.startTime))}
                </Text>
              </View>
              
              {activity.settings?.autoSilence && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="volume-off" size={14} color={COLORS.gray[500]} style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 12, color: COLORS.text.secondary }}>
                    Silenced
                  </Text>
                </View>
              )}
              
              {activity.settings?.autoReply && (
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Icon name="message-reply" size={14} color={COLORS.gray[500]} style={{ marginRight: 4 }} />
                  <Text style={{ fontSize: 12, color: COLORS.text.secondary }}>
                    Auto-reply
                  </Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {modeHistory.length > 3 && (
        <TouchableOpacity 
          onPress={onSeeAll}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 16,
            padding: 12,
            backgroundColor: COLORS.primary[50],
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.primary[100],
          }}
        >
          <Text style={{ 
            fontSize: 14, 
            fontWeight: '600', 
            color: COLORS.primary[700],
            marginRight: 8,
          }}>
            View all {modeHistory.length} activities
          </Text>
          <Icon name="chevron-right" size={16} color={COLORS.primary[600]} />
        </TouchableOpacity>
      )}
    </View>
  );
};