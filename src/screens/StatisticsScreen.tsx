import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatisticsHeader } from '@/components/statistics/StatisticsHeader';
import { UsageOverview } from '@/components/statistics/UsageOverview';
import { ModeAnalytics } from '@/components/statistics/ModeAnalytics';
import { ProductivityChart } from '@/components/statistics/ProductivityChart';
import { InsightsCard } from '@/components/statistics/InsightsCard';
import { useModeStore } from '@/store/modeStore';

export const StatisticsScreen = () => {
  const { modeHistory, activeModes } = useModeStore();

  const totalModesUsed = modeHistory.length;
  const totalTimeInModes = modeHistory.reduce((total, mode) => {
    const start = new Date(mode.startTime);
    const end = mode.endTime ? new Date(mode.endTime) : new Date();
    return total + (end.getTime() - start.getTime());
  }, 0);
  const hoursSaved = Math.round(totalTimeInModes / 3600000);

  const statsData = {
    totalModesUsed,
    totalTimeInModes,
    hoursSaved,
    averageSession: Math.round(totalTimeInModes / totalModesUsed / 60000) || 0,
    currentActive: activeModes.length,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <StatisticsHeader />
        <UsageOverview stats={statsData} />
        <ModeAnalytics modeHistory={modeHistory} />
        <ProductivityChart modeHistory={modeHistory} />
        <InsightsCard stats={statsData} />
      </ScrollView>
    </SafeAreaView>
  );
};