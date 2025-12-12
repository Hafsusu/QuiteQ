import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '@/constants/colors';

import { HomeScreen } from '@/screens/HomeScreen';
import { ModesScreen } from '@/screens/ModesScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { RootStackParamList } from '@/@types/navigation';
import { ModeDetailScreen } from '@/screens/ModeDetailScreen';
import { StatisticsScreen } from '@/screens/StatisticsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Home" component={HomeScreen} />
    <Stack.Screen name="ModeDetail" component={ModeDetailScreen} />
    <Stack.Screen name="Statistics" component={StatisticsScreen} />
  </Stack.Navigator>
);

const ModesStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Modes" component={ModesScreen} />
    <Stack.Screen name="ModeDetail" component={ModeDetailScreen} />
  </Stack.Navigator>
);

export const MainNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ModesTab') {
            iconName = focused ? 'view-grid' : 'view-grid-outline';
          } else if (route.name === 'StatisticsTab') {
            iconName = focused ? 'chart-bar' : 'chart-bar-outline';
          } else if (route.name === 'SettingsTab') {
            iconName = focused ? 'cog' : 'cog-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary[700],
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: COLORS.gray[200],
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="ModesTab" 
        component={ModesStack} 
        options={{ title: 'Modes' }}
      />
      <Tab.Screen 
        name="StatisticsTab" 
        component={StatisticsScreen} 
        options={{ title: 'Stats' }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
};