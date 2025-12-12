import React from 'react';
import { ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/home/Header';
import { ActiveModesBanner } from '@/components/home/ActiveModesBanner';
import { QuickStartSection } from '@/components/home/QuickStartSection';
import { TipsCard } from '@/components/home/TipsCard';
import { MODE_LIST } from '@/constants/modes';
import { useModeStore } from '@/store/modeStore';
import { useNavigation } from '@react-navigation/native';
import { RecentActivity } from '@/components/home/RecentActivity';

export const HomeScreen = () => {
  const navigation = useNavigation();
  const { activeModes, deactivateAllModes } = useModeStore();

  const handleModeSelect = (mode: typeof MODE_LIST[0]) => {
    navigation.navigate('ModeDetail', { modeId: mode.id });
  };

  const handleStatsPress = () => {
    navigation.navigate('Statistics');
  };

  const handleSeeAllActivity = () => {
    Alert.alert('Coming Soon', 'Activity history feature coming soon!');
  };
  const handleStopAll = () => {
    Alert.alert(
      'Stop All Modes',
      'Are you sure you want to stop all active modes?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Stop All', 
          style: 'destructive',
          onPress: deactivateAllModes 
        }
      ]
    );
  };

  const tips = [
    'Each mode has customizable auto-reply messages',
    'Schedule modes to activate automatically at specific times',
    'Set up location-based activation with geofencing',
    'Emergency contacts can always reach you, even in active modes',
    'Customize vibration patterns for different modes',
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView 
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Header
          title="Quiet Assistant"
          subtitle="Focus on what matters most"
          onStatsPress={handleStatsPress}
        />

        <ActiveModesBanner
          activeModes={activeModes}
          onStopAll={handleStopAll}
        />

        <QuickStartSection
          modes={MODE_LIST}
          onModeSelect={handleModeSelect}
        />

        <RecentActivity onSeeAll={handleSeeAllActivity} />

        <TipsCard tips={tips} />
      </ScrollView>
    </SafeAreaView>
  );
};