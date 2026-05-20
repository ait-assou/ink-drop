export const theme = {
  colors: {
    background: '#0B0B0C',
    surface: '#131316',
    surfaceSecondary: '#1C1C21',
    border: '#2A2A32',
    borderLight: '#3E3E4A',
    text: '#F5F5F7',
    textSecondary: '#9A9A9F',
    textMuted: '#5C5C61',
    primary: '#6D5FFD',      // Immersive violet
    primaryDark: '#5243D2',
    accent: '#EC4899',       // Artistic deep pink
    accentDark: '#BE185D',
    gold: '#FFB020',         // Warm streak gold
    goldDark: '#E08A00',
    emerald: '#10B981',      // Success & levels
    crimson: '#EF4444',      // Danger
    glass: 'rgba(25, 25, 28, 0.7)',
    glassDark: 'rgba(15, 15, 17, 0.85)',
    cardGradStart: '#18181C',
    cardGradEnd: '#111113',
    vsGradStart: '#2A1E4D',  // Story Battle VS Background
    vsGradEnd: '#1A0E2A',
  },
  fonts: {
    serif: 'Lora_400Regular',
    serifItalic: 'Lora_400Regular_Italic',
    serifBold: 'Lora_700Bold',
    sans: 'Outfit_400Regular',
    sansMedium: 'Outfit_500Medium',
    sansBold: 'Outfit_700Bold',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 6,
    md: 12,
    lg: 20,
    xl: 28,
    round: 9999,
  },
  shadows: {
    subtle: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 6,
      elevation: 3,
    },
    accent: {
      shadowColor: '#6D5FFD',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    glow: {
      shadowColor: '#EC4899',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    }
  }
};
