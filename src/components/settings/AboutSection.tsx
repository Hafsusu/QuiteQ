import React from 'react';
import { View, Text, TouchableOpacity, Linking, Alert, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { useSettingsStore } from '@/store/settingsStore';

export const AboutSection: React.FC = () => {
  const { settings, updateSettings, resetToDefaults } = useSettingsStore();

  const handleReset = () => {
    Alert.alert(
      'Reset Settings',
      'Are you sure you want to reset all settings to default?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reset', 
          style: 'destructive',
          onPress: resetToDefaults,
        }
      ]
    );
  };

  const handlePrivacySetting = (key: keyof typeof settings.privacy) => {
    updateSettings({
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key],
      },
    });
  };

  const menuItems = [
    {
      title: 'Privacy Policy',
      icon: 'shield-lock',
      onPress: () => Linking.openURL('https://example.com/privacy'),
    },
    {
      title: 'Terms of Service',
      icon: 'file-document',
      onPress: () => Linking.openURL('https://example.com/terms'),
    },
    {
      title: 'Send Feedback',
      icon: 'email',
      onPress: () => Linking.openURL('mailto:support@example.com'),
    },
    {
      title: 'Rate App',
      icon: 'star',
      onPress: () => Alert.alert('Coming Soon', 'App rating feature coming soon!'),
    },
    {
      title: 'Reset Settings',
      icon: 'restore',
      onPress: handleReset,
      color: COLORS.error[500],
    },
  ];

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24, marginBottom: 32 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Icon name="information" size={20} color={COLORS.primary[600]} />
        <Text style={{ 
          fontSize: 22, 
          fontWeight: '700', 
          color: COLORS.text.primary,
          marginLeft: 8,
        }}>
          About & Privacy
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
          <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text.primary, marginBottom: 12 }}>
            Privacy Settings
          </Text>
          
          {[
            { key: 'analytics' as const, label: 'Analytics & Usage Data', description: 'Help improve the app anonymously' },
            { key: 'crashReports' as const, label: 'Crash Reports', description: 'Automatically send crash reports' },
          ].map((item) => (
            <TouchableOpacity
              key={item.key}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                borderTopWidth: item.key === 'crashReports' ? 1 : 0,
                borderTopColor: COLORS.gray[100],
              }}
              onPress={() => handlePrivacySetting(item.key)}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, color: COLORS.text.primary }}>
                  {item.label}
                </Text>
                <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>
                  {item.description}
                </Text>
              </View>
              <Switch
                value={settings.privacy[item.key]}
                onValueChange={() => handlePrivacySetting(item.key)}
                trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
                thumbColor="#fff"
                ios_backgroundColor={COLORS.gray[300]}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ borderTopWidth: 1, borderTopColor: COLORS.gray[100], paddingTop: 16 }}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 12,
                borderBottomWidth: index < menuItems.length - 1 ? 1 : 0,
                borderBottomColor: COLORS.gray[100],
              }}
              onPress={item.onPress}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon 
                  name={item.icon} 
                  size={20} 
                  color={item.color || COLORS.gray[600]} 
                  style={{ marginRight: 12 }}
                />
                <Text style={{ 
                  fontSize: 15, 
                  color: item.color || COLORS.text.primary,
                  fontWeight: item.color ? '600' : '400',
                }}>
                  {item.title}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ 
          backgroundColor: COLORS.primary[50], 
          borderRadius: 12, 
          padding: 12, 
          marginTop: 16,
          alignItems: 'center',
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: COLORS.primary[900], marginBottom: 4 }}>
            Quiet Assistant v1.0.0
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.primary[700], textAlign: 'center' }}>
            Made with ❤️ to help you stay focused on what matters most
          </Text>
        </View>
      </View>
    </View>
  );
};