export const COLORS = {
  primary: {
    50: '#eaf1fb',
    100: '#d5e3f6',
    200: '#abc8ed',
    300: '#81ace4',
    400: '#5790db',
    500: '#2d74d2',
    600: '#245da8',
    700: '#1b467e',
    800: '#122f54',
    900: '#09172a',
    950: '#06101d',
  },
  
  success: {
    500: '#10b981',
    600: '#059669',
  },
  warning: {
    500: '#f59e0b',
    600: '#d97706',
  },
  error: {
    500: '#ef4444',
    600: '#dc2626',
  },
  info: {
    500: '#3b82f6',
    600: '#2563eb',
  },
  
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  
  background: {
    light: '#ffffff',
    dark: '#09172a',
  },
  surface: {
    light: '#ffffff',
    dark: '#122f54',
  },
  
  text: {
    primary: '#111827',
    secondary: '#6b7280',
    disabled: '#9ca3af',
    inverse: '#ffffff',
  },
} as const;

export type ColorTheme = typeof COLORS;