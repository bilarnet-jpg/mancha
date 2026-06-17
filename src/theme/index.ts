export const Colors = {
  // BASE — verde escuro vivo, nunca preto puro
  bg: '#0A1F14',
  bgSecondary: '#0D2818',
  bgElevated: '#11331D',

  // GLASS — glassmorphism
  glass: 'rgba(20, 56, 34, 0.55)',
  glassLight: 'rgba(255, 255, 255, 0.06)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
  glassBorderStrong: 'rgba(255, 255, 255, 0.2)',

  // VERDE — cor de marca
  primary: '#00FF85',
  primaryBright: '#3DFFA0',
  primaryDeep: '#00C46A',
  primaryMuted: 'rgba(0, 255, 133, 0.15)',

  // DOURADO — acentos premium
  gold: '#FFD874',
  goldDeep: '#E8B94A',
  goldMuted: 'rgba(255, 216, 116, 0.15)',
  goldBorder: 'rgba(255, 216, 116, 0.3)',

  // OUTRAS CORES DE CATEGORIA (mantidas para badges/tags)
  red: '#FF5A5A',
  redMuted: 'rgba(255, 90, 90, 0.15)',

  // TEXTO
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.45)',
  textMuted: 'rgba(255, 255, 255, 0.45)',
  textInverse: '#052D18',

  // LEGADO — mantido para compatibilidade com telas antigas durante a migração
  bgCard: 'rgba(20, 56, 34, 0.55)',
  border: 'rgba(255, 255, 255, 0.12)',

  // GRADIENTES
  gradientPrimary: ['#3DFFA0', '#00C46A'],
  gradientGold: ['#FFD874', '#E8B94A'],
  gradientHero: ['#134227', '#0A1F14'],
  gradientBg: ['#134227', '#0A1F14', '#051209'],
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const Radius = {
  sm: 8,
  md: 14,
  lg: 20,
  xl: 28,
  full: 999,
};

export const Blur = {
  intensity: 40,
  tint: 'dark' as const,
};
