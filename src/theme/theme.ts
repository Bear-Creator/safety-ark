import { MD3LightTheme } from 'react-native-paper'

export const AppTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#e63946',
    onPrimary: '#ffffff',
    primaryContainer: '#ffdad7',
    secondary: '#2ec4b6',
    onSecondary: '#ffffff',
    secondaryContainer: '#b2efea',
    background: '#f5f7fa',
    surface: '#ffffff',
    onSurface: '#1a1f2e',
    surfaceVariant: '#f0f2f5',
    outline: '#e0e4eb',
    error: '#e63946',
  },
  fonts: {
    ...MD3LightTheme.fonts,
  },
}

export const Colors = {
  accent: '#e63946',
  accent2: '#ff6b6b',
  safe: '#2ec4b6',
  warn: '#f4a261',
  bg: '#f5f7fa',
  surface: '#ffffff',
  text: '#1a1f2e',
  text2: '#586069',
  text3: '#8b949e',
  gradientSafe: ['#2ec4b6', '#1aada0'] as const,
  gradientWarn: ['#f4a261', '#e08040'] as const,
  gradientDanger: ['#e63946', '#c0242f'] as const,
}
