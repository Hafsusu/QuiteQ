import { COLORS } from './colors';

export type ModeType = 'prayer' | 'meeting' | 'nap' | 'study' | 'custom';

export interface ModeConfig {
  id: string;
  name: string;
  type: ModeType;
  icon: string;
  color: string;
  defaultMessage: string;
  defaultDuration: number;
  autoSilence: boolean;
  autoReply: boolean;
  canSchedule: boolean;
  canGeofence: boolean;
}

export const MODES: Record<ModeType, ModeConfig> = {
  prayer: {
    id: 'prayer',
    name: 'Prayer Mode',
    type: 'prayer',
    icon: 'prayer',
    color: COLORS.primary[600],
    defaultMessage: "I'm currently at the mosque/praying. I'll call you back soon, Insha'Allah.",
    defaultDuration: 30,
    autoSilence: true,
    autoReply: true,
    canSchedule: true,
    canGeofence: true,
  },
  meeting: {
    id: 'meeting',
    name: 'Meeting Mode',
    type: 'meeting',
    icon: 'account-group',
    color: COLORS.info[600],
    defaultMessage: "I'm in a meeting right now. I'll get back to you as soon as possible.",
    defaultDuration: 60,
    autoSilence: true,
    autoReply: true,
    canSchedule: true,
    canGeofence: true,
  },
  nap: {
    id: 'nap',
    name: 'Nap Mode',
    type: 'nap',
    icon: 'sleep',
    color: COLORS.warning[600],
    defaultMessage: "I'm taking a nap. I'll call you back when I wake up.",
    defaultDuration: 45,
    autoSilence: true,
    autoReply: true,
    canSchedule: true,
    canGeofence: false,
  },
  study: {
    id: 'study',
    name: 'Study Mode',
    type: 'study',
    icon: 'book-education',
    color: COLORS.success[600],
    defaultMessage: "I'm studying/working right now. I'll respond when I take a break.",
    defaultDuration: 90,
    autoSilence: true,
    autoReply: true,
    canSchedule: true,
    canGeofence: false,
  },
  custom: {
    id: 'custom',
    name: 'Custom Mode',
    type: 'custom',
    icon: 'cog',
    color: COLORS.gray[600],
    defaultMessage: "I'm currently unavailable. I'll get back to you soon.",
    defaultDuration: 60,
    autoSilence: true,
    autoReply: true,
    canSchedule: true,
    canGeofence: true,
  },
};

export const MODE_LIST = Object.values(MODES);