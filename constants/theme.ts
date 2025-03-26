export const theme = {
  colors: {
    primary: '#E5B94E', // Luxurious gold
    secondary: '#9D8FD0', // Soft purple
    accent: '#2A2D3E', // Deep navy
    background: '#141519', // Rich dark
    surface: '#1E1F25', // Elevated dark
    surfaceHover: '#252731', // Hover state
    text: '#FFFFFF',
    textSecondary: '#A0A0A6',
    disabled: '#3A3B45',
    border: '#2A2B33',
    error: '#FF4444',
    success: '#44FF44',
    overlay: 'rgba(20, 21, 25, 0.85)',
    gradient: {
      primary: ['#E5B94E', '#C7934A'],
      dark: ['rgba(20, 21, 25, 0)', 'rgba(20, 21, 25, 0.95)'],
    },
  },
  fonts: {
    regular: 'Inter-Regular',
    bold: 'Inter-Bold',
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
    lg: 16,
    xl: 24,
    full: 999,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.44,
      shadowRadius: 16,
      elevation: 8,
    },
  },
};