import React from 'react';
import { View, Text, Switch, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';
import { Settings } from '@/store/settingsStore';

interface EmergencySettingsProps {
  settings: Settings;
  onUpdate: (updates: Partial<Settings>) => void;
}

export const EmergencySettings: React.FC<EmergencySettingsProps> = ({ 
  settings, 
  onUpdate 
}) => {
  const toggleEmergencySetting = (key: keyof Settings['emergency']) => {
    if (key === 'contacts' || key === 'maxCalls') return;
    
    onUpdate({
      emergency: {
        ...settings.emergency,
        [key]: !settings.emergency[key],
      },
    });
  };

  const updateMaxCalls = (value: number) => {
    onUpdate({
      emergency: {
        ...settings.emergency,
        maxCalls: value,
      },
    });
  };

  const addEmergencyContact = () => {
    Alert.alert('Coming Soon', 'Contact selection feature coming soon!');
  };

  return (
    <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <Icon name="alert-circle" size={20} color={COLORS.error[500]} />
        <Text style={{ 
          fontSize: 22, 
          fontWeight: '700', 
          color: COLORS.text.primary,
          marginLeft: 8,
        }}>
          Emergency Settings
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
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.gray[100],
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name="shield-check" size={20} color={COLORS.gray[600]} style={{ marginRight: 12 }} />
            <Text style={{ fontSize: 15, color: COLORS.text.primary }}>
              Emergency Bypass
            </Text>
          </View>
          <Switch
            value={settings.emergency.bypassEnabled}
            onValueChange={() => toggleEmergencySetting('bypassEnabled')}
            trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
            thumbColor="#fff"
            ios_backgroundColor={COLORS.gray[300]}
          />
        </View>

        {settings.emergency.bypassEnabled && (
          <>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: COLORS.gray[100],
              }}
              onPress={addEmergencyContact}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="account-plus" size={20} color={COLORS.gray[600]} style={{ marginRight: 12 }} />
                <View>
                  <Text style={{ fontSize: 15, color: COLORS.text.primary }}>
                    Emergency Contacts
                  </Text>
                  <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 2 }}>
                    {settings.emergency.contacts.length} contacts added
                  </Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color={COLORS.gray[400]} />
            </TouchableOpacity>

            <View style={{ paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: COLORS.gray[100] }}>
              <Text style={{ fontSize: 15, fontWeight: '600', color: COLORS.text.primary, marginBottom: 12 }}>
                Max Emergency Calls
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                {[1, 2, 3, 5].map((num) => (
                  <TouchableOpacity
                    key={num}
                    onPress={() => updateMaxCalls(num)}
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 24,
                      backgroundColor: settings.emergency.maxCalls === num 
                        ? COLORS.primary[600] 
                        : COLORS.gray[200],
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ 
                      fontSize: 16, 
                      fontWeight: '700',
                      color: settings.emergency.maxCalls === num ? '#fff' : COLORS.text.primary,
                    }}>
                      {num}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={{ fontSize: 13, color: COLORS.text.secondary, marginTop: 8 }}>
                Number of calls allowed before emergency bypass activates
              </Text>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 12,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="vibrate" size={20} color={COLORS.gray[600]} style={{ marginRight: 12 }} />
                <Text style={{ fontSize: 15, color: COLORS.text.primary }}>
                  Vibrate During Emergency
                </Text>
              </View>
              <Switch
                value={settings.emergency.vibrateDuringEmergency}
                onValueChange={() => toggleEmergencySetting('vibrateDuringEmergency')}
                trackColor={{ false: COLORS.gray[300], true: COLORS.primary[400] }}
                thumbColor="#fff"
                ios_backgroundColor={COLORS.gray[300]}
              />
            </View>

            <View style={{ 
              backgroundColor: COLORS.error[500], 
              borderRadius: 12, 
              padding: 12, 
              marginTop: 16,
              borderWidth: 1,
              borderColor: COLORS.error[500],
            }}>
              <Text style={{ 
                fontSize: 13, 
                fontWeight: '600', 
                color: COLORS.error[600],
                marginBottom: 4,
              }}>
                Important
              </Text>
              <Text style={{ 
                fontSize: 12, 
                color: COLORS.error[600],
              }}>
                Emergency contacts can bypass all modes when they call consecutively.
                Make sure to add trusted contacts only.
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};