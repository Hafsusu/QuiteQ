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
export interface ModeHistory {
  id: string;
  type: ModeType;
  startTime: Date;
  endTime?: Date;
  settings: {
    autoSilence: boolean;
    autoReply: boolean;
    customMessage?: string;
    replyToContactsOnly: boolean;
    vibrateOnly: boolean;
  };
  duration: number;
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
  activeModes: ActiveMode[];
  modeHistory: ModeHistory[];
  callLogs: CallLog[];
  isInitialized: boolean;
  
  activateMode: (modeType: ModeType, duration?: number, customSettings?: Partial<ActiveMode['settings']>) => void;
  deactivateMode: (modeId: string) => void;
  deactivateAllModes: () => void;
  updateModeSettings: (modeId: string, settings: Partial<ActiveMode['settings']>) => void;
  addCallLog: (log: Omit<CallLog, 'id'>) => void;
  clearCallLogs: () => void;
  clearHistory: () => void;
  initializeStore: () => void;
  getModeHistory: (filters?: {
    startDate?: Date;
    endDate?: Date;
    modeType?: ModeType;
  }) => ModeHistory[];
  getModeStats: () => {
    totalModesUsed: number;
    totalTimeInModes: number; 
    averageSessionLength: number; 
    mostUsedMode: ModeType | null;
    modeUsage: Record<ModeType, number>; 
  };
  _fixDates: () => void;
}

const convertDatesToISO = (state: {
  activeModes: ActiveMode[];
  modeHistory: ModeHistory[];
  callLogs: CallLog[];
}) => {
  return {
    activeModes: state.activeModes.map(mode => ({
      ...mode,
      startTime: mode.startTime.toISOString(),
      endTime: mode.endTime?.toISOString(),
    })),
    modeHistory: state.modeHistory.map(history => ({
      ...history,
      startTime: history.startTime.toISOString(),
      endTime: history.endTime?.toISOString(),
    })),
    callLogs: state.callLogs.map(log => ({
      ...log,
      timestamp: log.timestamp.toISOString(),
    })),
  };
};

const convertISOToDates = (state: any) => {
  return {
    ...state,
    activeModes: state.activeModes?.map((mode: any) => ({
      ...mode,
      startTime: new Date(mode.startTime),
      endTime: mode.endTime ? new Date(mode.endTime) : undefined,
    })) || [],
    modeHistory: state.modeHistory?.map((history: any) => ({
      ...history,
      startTime: new Date(history.startTime),
      endTime: history.endTime ? new Date(history.endTime) : undefined,
    })) || [],
    callLogs: state.callLogs?.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp),
    })) || [],
  };
};

export const useModeStore = create<ModeStore>()(
  persist(
    (set, get) => ({
      activeModes: [],
      modeHistory: [],
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
        const state = get();
        const mode = state.activeModes.find(m => m.id === modeId);
        
        if (mode) {
          const endTime = new Date();
          const duration = Math.round((endTime.getTime() - mode.startTime.getTime()) / 60000);
          
          const historyEntry: ModeHistory = {
            id: `history-${Date.now()}`,
            type: mode.type,
            startTime: mode.startTime,
            endTime: endTime,
            settings: mode.settings,
            duration: duration,
          };

          set((state) => ({
            activeModes: state.activeModes.filter((mode) => mode.id !== modeId),
            modeHistory: [historyEntry, ...state.modeHistory].slice(0, 1000),
          }));
          
          console.log(`Mode ${modeId} deactivated and added to history`);
        } else {
          console.log(`Mode ${modeId} not found`);
        }
      },

      deactivateAllModes: () => {
        const state = get();
        const now = new Date();
        
        const historyEntries: ModeHistory[] = state.activeModes.map(mode => {
          const duration = Math.round((now.getTime() - mode.startTime.getTime()) / 60000);
          return {
            id: `history-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type: mode.type,
            startTime: mode.startTime,
            endTime: now,
            settings: mode.settings,
            duration: duration,
          };
        });

        set((state) => ({
          activeModes: [],
          modeHistory: [...historyEntries, ...state.modeHistory].slice(0, 1000),
        }));
        
        console.log('All modes deactivated and added to history');
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

      clearHistory: () => {
        set({ modeHistory: [] });
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

      getModeHistory: (filters) => {
        const state = get();
        let filteredHistory = [...state.modeHistory];

        if (filters?.startDate) {
          const startDate = new Date(filters.startDate);
          filteredHistory = filteredHistory.filter(entry => 
            entry.startTime >= startDate
          );
        }

        if (filters?.endDate) {
          const endDate = new Date(filters.endDate);
          filteredHistory = filteredHistory.filter(entry => 
            entry.startTime <= endDate
          );
        }

        if (filters?.modeType) {
          filteredHistory = filteredHistory.filter(entry => 
            entry.type === filters.modeType
          );
        }

        return filteredHistory;
      },

      getModeStats: () => {
        const state = get();
        const stats = {
          totalModesUsed: state.modeHistory.length,
          totalTimeInModes: 0,
          averageSessionLength: 0,
          mostUsedMode: null as ModeType | null,
          modeUsage: {} as Record<ModeType, number>,
        };

        const modeCounts: Record<ModeType, number> = {} as Record<ModeType, number>;
        let totalDuration = 0;

        state.modeHistory.forEach(entry => {
          modeCounts[entry.type] = (modeCounts[entry.type] || 0) + 1;
          
          totalDuration += entry.duration;
        });

        let maxCount = 0;
        let mostUsed: ModeType | null = null;
        Object.entries(modeCounts).forEach(([modeType, count]) => {
          stats.modeUsage[modeType as ModeType] = count;
          if (count > maxCount) {
            maxCount = count;
            mostUsed = modeType as ModeType;
          }
        });

        stats.totalTimeInModes = totalDuration;
        stats.averageSessionLength = stats.totalModesUsed > 0 
          ? Math.round(totalDuration / stats.totalModesUsed) 
          : 0;
        stats.mostUsedMode = mostUsed;

        return stats;
      },

      _fixDates: () => {
        set((state) => {
          const fixedActiveModes = state.activeModes.map(mode => ({
            ...mode,
            startTime: mode.startTime instanceof Date ? mode.startTime : new Date(mode.startTime),
            endTime: mode.endTime instanceof Date ? mode.endTime : (mode.endTime ? new Date(mode.endTime) : undefined),
          }));
          
          const fixedModeHistory = state.modeHistory.map(history => ({
            ...history,
            startTime: history.startTime instanceof Date ? history.startTime : new Date(history.startTime),
            endTime: history.endTime instanceof Date ? history.endTime : (history.endTime ? new Date(history.endTime) : undefined),
          }));
          
          const fixedCallLogs = state.callLogs.map(log => ({
            ...log,
            timestamp: log.timestamp instanceof Date ? log.timestamp : new Date(log.timestamp),
          }));
          
          return {
            activeModes: fixedActiveModes,
            modeHistory: fixedModeHistory,
            callLogs: fixedCallLogs,
          };
        });
      },
    }),
    {
      name: 'mode-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => {
        return convertDatesToISO(state);
      },
      onRehydrateStorage: () => (persistedState) => {
        if (persistedState) {
          const stateWithDates = convertISOToDates(persistedState);
          setTimeout(() => {
            useModeStore.setState({
              activeModes: stateWithDates.activeModes,
              modeHistory: stateWithDates.modeHistory,
              callLogs: stateWithDates.callLogs,
            });
          }, 0);
        }
      },
    }
  )
);

useModeStore.getState().initializeStore();