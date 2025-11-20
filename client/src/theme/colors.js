// KaamHeru Color Palette
// Professional Blue, White, and Gray theme

export const colors = {
  // Primary Brand Colors - Professional Blue
  primary: {
    50: '#e3f2fd',
    100: '#bbdefb',
    200: '#90caf9',
    300: '#64b5f6',
    400: '#42a5f5',
    500: '#1976d2', // Main Primary
    600: '#1565c0',
    700: '#0d47a1',
    800: '#0a3d91',
    900: '#073274',
  },

  // Secondary Colors - Professional Gray
  secondary: {
    50: '#f5f5f5',
    100: '#eeeeee',
    200: '#e0e0e0',
    300: '#bdbdbd',
    400: '#9e9e9e',
    500: '#757575', // Main Secondary
    600: '#616161',
    700: '#424242',
    800: '#212121', // Main Text
    900: '#000000',
  },

  // Background Colors
  background: {
    default: '#f5f5f5', // Light Gray
    paper: '#ffffff',   // White
    dark: '#fafafa',    // Very Light Gray
  },

  // Surface Colors
  surface: {
    main: '#ffffff',
    variant: '#f8f9fa',
    elevated: '#ffffff',
  },

  // Text Colors
  text: {
    primary: '#212121',   // Dark Gray
    secondary: '#757575', // Medium Gray
    disabled: '#bdbdbd',  // Light Gray
    hint: '#9e9e9e',      // Hint Gray
  },

  // Status Colors
  success: {
    main: '#2e7d32',
    light: '#4caf50',
    dark: '#1b5e20',
    contrast: '#ffffff',
  },

  warning: {
    main: '#ed6c02',
    light: '#ff9800',
    dark: '#e65100',
    contrast: '#ffffff',
  },

  error: {
    main: '#d32f2f',
    light: '#f44336',
    dark: '#c62828',
    contrast: '#ffffff',
  },

  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrast: '#ffffff',
  },

  // Project Status Colors
  projectStatus: {
    planned: '#757575',
    inProgress: '#1976d2',
    delayed: '#ed6c02',
    completed: '#2e7d32',
    cancelled: '#d32f2f',
  },

  // Role Colors
  roles: {
    public: '#1976d2',
    contractor: '#ed6c02',
    admin: '#d32f2f',
  },

  // Municipality Colors (for visual differentiation)
  municipalities: {
    bharatpur: '#1976d2',
    ratnanagar: '#2e7d32',
    kawasoti: '#ed6c02',
    gaindakot: '#7b1fa2',
    madhyabindu: '#0288d1',
  },

  // Border and Divider Colors
  border: {
    light: '#e0e0e0',
    main: '#bdbdbd',
    dark: '#757575',
  },

  // Shadow Colors
  shadow: {
    light: 'rgba(0, 0, 0, 0.05)',
    medium: 'rgba(0, 0, 0, 0.1)',
    dark: 'rgba(0, 0, 0, 0.15)',
  },

  // Gradient Colors
  gradients: {
    primary: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
    secondary: 'linear-gradient(135deg, #546e7a 0%, #78909c 100%)',
    success: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
    warning: 'linear-gradient(135deg, #ed6c02 0%, #ff9800 100%)',
    error: 'linear-gradient(135deg, #d32f2f 0%, #f44336 100%)',
  },
};

// Helper functions for getting colors
export const getColor = (category, shade = 'main') => {
  return colors[category]?.[shade] || colors.text.primary;
};

export const getStatusColor = (status) => {
  return colors.projectStatus[status] || colors.text.secondary;
};

export const getRoleColor = (role) => {
  return colors.roles[role] || colors.text.secondary;
};

export const getMunicipalityColor = (municipality) => {
  const key = municipality.toLowerCase().replace(/\s+/g, '');
  return colors.municipalities[key] || colors.primary.main;
};

export default colors;
