import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HomeScreen } from '@/screens/HomeScreen';
import { COLORS } from '@/constants/colors';
import { ModesScreen } from '@/screens/ModesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary[500],
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: {
          backgroundColor: COLORS.background.light,
          borderTopColor: COLORS.gray[200],
          paddingBottom: 4,
          paddingTop: 4,
          height: 60,
        },
        headerStyle: {
          backgroundColor: COLORS.primary[900],
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Modes"
        component={ModesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="timer-sand" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Icon name="cog" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};