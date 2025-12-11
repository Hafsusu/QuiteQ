import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MODES, ModeType } from '@/constants/modes';

export interface ActiveMode {
  id: string;
  type: ModeType;
  startTime: Date;
  endTime?: Date;
  isActive: boolean;
  settings: {
    autoSilence: boolean;
    autoReply: boolean;
    customMessage?: string;
    replyToContactsOnly: boolean;
    vibrateOnly: boolean;
  };
}

export interface CallLog {
  id: string;
  phoneNumber: string;
  timestamp: Date;
  modeType: ModeType;
  messageSent: string;
  status: 'sent' | 'failed' | 'pending';
}

interface ModeStore {
  // State
  activeModes: ActiveMode[];
  callLogs: CallLog[];
  isInitialized: boolean;
  
  // Actions
  activateMode: (modeType: ModeType, duration?: number, customSettings?: Partial<ActiveMode['settings']>) => void;
  deactivateMode: (modeId: string) => void;
  deactivateAllModes: () => void;
  updateModeSettings: (modeId: string, settings: Partial<ActiveMode['settings']>) => void;
  addCallLog: (log: Omit<CallLog, 'id'>) => void;
  clearCallLogs: () => void;
  initializeStore: () => void;
}

export const useModeStore = create<ModeStore>()(
  persist(
    (set, ) => ({
      activeModes: [],
      callLogs: [],
      isInitialized: false,

      activateMode: (modeType, duration, customSettings) => {
        const modeConfig = MODES[modeType];
        const defaultDuration = duration || modeConfig.defaultDuration;
        
        const newMode: ActiveMode = {
          id: `${modeType}-${Date.now()}`,
          type: modeType,
          startTime: new Date(),
          endTime: new Date(Date.now() + defaultDuration * 60 * 1000),
          isActive: true,
          settings: {
            autoSilence: modeConfig.autoSilence,
            autoReply: modeConfig.autoReply,
            customMessage: customSettings?.customMessage || modeConfig.defaultMessage,
            replyToContactsOnly: customSettings?.replyToContactsOnly || false,
            vibrateOnly: customSettings?.vibrateOnly || false,
          },
        };

        set((state) => ({
          activeModes: [...state.activeModes, newMode],
        }));

        console.log(`Mode ${modeType} activated`);
      },

      deactivateMode: (modeId) => {
        set((state) => ({
          activeModes: state.activeModes.filter((mode) => mode.id !== modeId),
        }));
        console.log(`Mode ${modeId} deactivated`);
      },

      deactivateAllModes: () => {
        set({ activeModes: [] });
        console.log('All modes deactivated');
      },

      updateModeSettings: (modeId, settings) => {
        set((state) => ({
          activeModes: state.activeModes.map((mode) =>
            mode.id === modeId
              ? { ...mode, settings: { ...mode.settings, ...settings } }
              : mode
          ),
        }));
      },

      addCallLog: (log) => {
        const newLog: CallLog = {
          ...log,
          id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };

        set((state) => ({
          callLogs: [newLog, ...state.callLogs].slice(0, 1000),
        }));
      },

      clearCallLogs: () => {
        set({ callLogs: [] });
      },

      initializeStore: () => {
        const now = new Date();
        set((state) => ({
          activeModes: state.activeModes.filter((mode) => {
            if (!mode.endTime) return true;
            return mode.endTime > now;
          }),
          isInitialized: true,
        }));
      },
    }),
    {
      name: 'mode-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeModes: state.activeModes,
        callLogs: state.callLogs,
      }),
    }
  )
);