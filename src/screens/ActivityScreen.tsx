import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useModeStore } from '@/store/modeStore';
import { ActivityFilters } from '@/components/activity/ActivityFilters';
import { ActivityHeader } from '@/components/activity/ActivityHeader';
import { ActivityList } from '@/components/activity/ActivityList';
import { ActivitySummary } from '@/components/activity/ActivitySummary';

export const ActivityScreen = () => {
  const { modeHistory } = useModeStore();
  const [filter, setFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  const [selectedMode, setSelectedMode] = useState<string>('all');

  const filteredActivities = modeHistory.filter(activity => {
    const activityDate = new Date(activity.startTime);
    const now = new Date();
    
    if (filter === 'today') {
      return activityDate.toDateString() === now.toDateString();
    }
    
    if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return activityDate >= weekAgo;
    }
    
    if (filter === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      return activityDate >= monthAgo;
    }
    
    return true;
  }).filter(activity => {
    if (selectedMode === 'all') return true;
    return activity.type === selectedMode;
  }).sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <ActivityHeader activityCount={filteredActivities.length} />
        <ActivityFilters 
          currentFilter={filter}
          onFilterChange={setFilter}
          selectedMode={selectedMode}
          onModeChange={setSelectedMode}
        />
        <ActivitySummary activities={filteredActivities} />
        <ActivityList activities={filteredActivities} />
      </ScrollView>
    </SafeAreaView>
  );
};