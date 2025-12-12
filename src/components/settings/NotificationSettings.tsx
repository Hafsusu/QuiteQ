import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { Settings } from '@/store/settingsStore'


interface NotificationSettingsProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  settings, 
  onUpdate 
}) => {
  const toggleNotification = (key: keyof Settings['notifications']) => {
    onUpdate({
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key],
      },
    });
  };

  const toggleSilentHours = () => {
    onUpdate({
      notifications: {
        ...settings.notifications,
        silentHours: {
          ...settings.notifications.silentHours,
          enabled: !settings.notifications.silentHours.enabled,
        },
      },
    });
  };

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Icon name="bell" size={20} color={COLORS.primary[600]} />
        <Text style={{ 
          fontSize: 22, 
          fontWeight: '700', 
          color: COLORS.text.primary,
          marginLeft: 8,
        }}>
          Notifications
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
        {[
          { key: 'enabled' as const, label: 'Enable Notifications', icon: 'bell-outline' },
          { key: 'sound' as const, label: 'Sound', icon: 'volume-high' },
          { key: 'vibration' as const, label: 'Vibration', icon: 'vibrate' },
        ].map((item) => (
          <View 
            key={item.key}
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: item.key !== 'vibration' ? 1 : 0,
              borderBottomColor: COLORS.gray[100],
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name={item.icon} size={20} color={COLORS.gray[600]} style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 15, color: COLORS.text.primary }}>
                {item.label}
              </Text>
            </View>
            <Switch
              value={settings.notifications[item.key]}
              onValueChange={() => toggleNotification(item.key)}
              trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
              thumbColor="#fff"
              ios_backgroundColor={COLORS.gray[300]}
            />
          </View>
        ))}
        
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 12,
            }}
            onPress={toggleSilentHours}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Icon name="moon-waning-crescent" size={20} color={COLORS.gray[600]} style={{ marginRight: 12 }} />
              <View>
                <Text style={{ fontSize: 15, color: COLORS.text.primary }}>
                  Silent Hours
                </Text>
                <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>
                  {settings.notifications.silentHours.startTime} - {settings.notifications.silentHours.endTime}
                </Text>
              </View>
            </View>
            <Switch
              value={settings.notifications.silentHours.enabled}
              onValueChange={toggleSilentHours}
              trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
              thumbColor="#fff"
              ios_backgroundColor={COLORS.gray[300]}
            />
          </TouchableOpacity>
          
          {settings.notifications.silentHours.enabled && (
            <View style={{ 
              backgroundColor: COLORS.primary[50], 
              borderRadius: 8, 
              padding: 12, 
              marginTop: 8,
            }}>
              <Text style={{ fontSize: 13, color: COLORS.primary[700] }}>
                Notifications will be silenced during these hours to avoid disturbances.
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};