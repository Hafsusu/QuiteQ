import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { Settings } from '@/store/settingsStore';

interface GeneralSettingsProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
}

export const GeneralSettings: React.FC<GeneralSettingsProps> = ({ 
  settings, 
  onUpdate 
}) => {
  const toggleGeneralSetting = (key: keyof Settings['general']) => {
    onUpdate({
      general: {
        ...settings.general,
        [key]: !settings.general[key],
      },
    });
  };

  const themes = [
    { value: 'light' as const, label: 'Light', icon: 'white-balance-sunny' },
    { value: 'dark' as const, label: 'Dark', icon: 'weather-night' },
    { value: 'auto' as const, label: 'Auto', icon: 'theme-light-dark' },
  ];

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'es', label: 'Spanish' },
    { value: 'fr', label: 'French' },
  ];

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Icon name="cog-outline" size={20} color={COLORS.primary[600]} />
        <Text style={{ 
          fontSize: 22, 
          fontWeight: '700', 
          color: COLORS.text.primary,
          marginLeft: 8,
        }}>
          General
        </Text>
      </View>
      
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
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 }}>
            Theme
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {themes.map((theme) => (
              <TouchableOpacity
                key={theme.value}
                onPress={() => onUpdate({ general: { ...settings.general, theme: theme.value } })}
                style={{
                  flex: 1,
                  alignItems: 'center',
                  padding: 12,
                  marginHorizontal: 4,
                  borderRadius: 12,
                  backgroundColor: settings.general.theme === theme.value 
                    ? COLORS.primary[100] 
                    : COLORS.gray[100],
                  borderWidth: settings.general.theme === theme.value ? 1 : 0,
                  borderColor: COLORS.primary[400],
                }}
              >
                <Icon name={theme.icon} size={20} color={
                  settings.general.theme === theme.value 
                    ? COLORS.primary[600] 
                    : COLORS.gray[600]
                } />
                <Text style={{ 
                  fontSize: 13, 
                  fontWeight: '600',
                  color: settings.general.theme === theme.value 
                    ? COLORS.primary[600] 
                    : COLORS.gray[600],
                  marginTop: 4,
                }}>
                  {theme.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text.primary, marginBottom: 8 }}>
            Language
          </Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.value}
                onPress={() => onUpdate({ general: { ...settings.general, language: lang.value } })}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: settings.general.language === lang.value 
                    ? COLORS.primary[600] 
                    : COLORS.gray[200],
                }}
              >
                <Text style={{ 
                  fontSize: 14, 
                  fontWeight: '600',
                  color: settings.general.language === lang.value ? '#fff' : COLORS.text.primary,
                }}>
                  {lang.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {[
          { key: 'autoStartOnBoot' as const, label: 'Auto-start on boot', icon: 'power' },
          { key: 'batteryOptimization' as const, label: 'Battery optimization', icon: 'battery' },
        ].map((item) => (
          <View 
            key={item.key}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 12,
              borderTopWidth: 1,
              borderTopColor: COLORS.gray[100],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={item.icon} size={20} color={COLORS.gray[600]} style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 15, color: COLORS.text.primary }}>
                {item.label}
              </Text>
            </View>
            <Switch
              value={settings.general[item.key]}
              onValueChange={() => toggleGeneralSetting(item.key)}
              trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
              thumbColor="#fff"
              ios_backgroundColor={COLORS.gray[300]}
            />
          </View>
        ))}
      </View>
    </View>
  );
};