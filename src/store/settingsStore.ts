import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Settings {
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    silentHours: {
      enabled: boolean;
      startTime: string;
      endTime: string;
    };
  };
  general: {
    theme: 'light' | 'dark' | 'auto';
    language: string;
    autoStartOnBoot: boolean;
    batteryOptimization: boolean;
  };
  emergency: {
    bypassEnabled: boolean;
    contacts: string[];
    maxCalls: number;
    vibrateDuringEmergency: boolean;
  };
  privacy: {
    analytics: boolean;
    crashReports: boolean;
  };
}

interface SettingsStore {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => void;
  resetToDefaults: () => void;
}

const defaultSettings: Settings = {
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    silentHours: {
      enabled: false,
      startTime: '22:00',
      endTime: '07:00',
    },
  },
  general: {
    theme: 'light',
    language: 'en',
    autoStartOnBoot: true,
    batteryOptimization: true,
  },
  emergency: {
    bypassEnabled: true,
    contacts: [],
    maxCalls: 3,
    vibrateDuringEmergency: true,
  },
  privacy: {
    analytics: true,
    crashReports: true,
  },
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, _get) => ({
      settings: defaultSettings,
      
      updateSettings: (updates) => {
        set((state) => ({
          settings: { ...state.settings, ...updates },
        }));
      },
      
      resetToDefaults: () => {
        set({ settings: defaultSettings });
      },
    }),
    {
      name: 'app-settings',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);