import { Dimensions } from 'react-native';
const { width: W } = Dimensions.get('window');

export const Colors = {
  primary: '#00FF85',
  primaryMuted: 'rgba(0,255,133,0.12)',
  red: '#E30613',
  redMuted: 'rgba(227,6,19,0.12)',
  gold: '#FFD700',
  goldMuted: 'rgba(255,215,0,0.12)',
  goldBorder: 'rgba(255,215,0,0.3)',
  bg: '#050505',
  bgCard: '#0E0E0E',
  bgGlass: 'rgba(255,255,255,0.06)',
  bgGlassBorder: 'rgba(255,255,255,0.10)',
  textPrimary: '#F5F5F5',
  textSecondary: '#A0A0A0',
  textMuted: '#505050',
  textInverse: '#050505',
  error: '#FF4D4F',
  border: '#1A1A1A',
  gradientPrimary: ['#00FF85', '#00CC6A'] as string[],
  gradientGold: ['#FFD700', '#B8860B'] as string[],
  gradientHero: ['#0d3d1a', '#051a0a', '#050505'] as string[],
};

export const Spacing = {
  xs: 4, sm: 8, md: 12, base: 16,
  lg: 20, xl: 24, xxl: 32,
};

export const Radius = {
  sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, full: 9999,
};

export const Layout = { screen: { width: W } };
