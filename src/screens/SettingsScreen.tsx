import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsHeader } from '@/components/settings/SettingsHeader';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { GeneralSettings } from '@/components/settings/GeneralSettings';
import { EmergencySettings } from '@/components/settings/EmergencySettings';
import { AboutSection } from '@/components/settings/AboutSection';
import { useSettingsStore } from '@/store/settingsStore';

export const SettingsScreen = () => {
  const { settings, updateSettings } = useSettingsStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <SettingsHeader />
        <NotificationSettings 
          settings={settings}
          onUpdate={updateSettings}
        />
        <GeneralSettings 
          settings={settings}
          onUpdate={updateSettings}
        />
        <EmergencySettings 
          settings={settings}
          onUpdate={updateSettings}
        />
        <AboutSection />
      </ScrollView>
    </SafeAreaView>
  );
};