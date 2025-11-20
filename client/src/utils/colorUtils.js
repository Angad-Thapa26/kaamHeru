import { useTheme } from '@mui/material/styles';

// Custom hook for accessing KaamHeru colors
export const useKaamHeruColors = () => {
  const theme = useTheme();
  
  return {
    // Primary colors
    primary: theme.palette.primary,
    secondary: theme.palette.secondary,
    
    // Status colors
    success: theme.palette.success,
    warning: theme.palette.warning,
    error: theme.palette.error,
    info: theme.palette.info,
    
    // Project status colors
    getProjectStatus: (status) => {
      return theme.palette.projectStatus?.[status] || theme.palette.text.secondary;
    },
    
    // Role colors
    getRoleColor: (role) => {
      return theme.palette.roleColors?.[role] || theme.palette.text.secondary;
    },
    
    // Municipality colors
    getMunicipalityColor: (municipality) => {
      const key = municipality?.toLowerCase().replace(/\s+/g, '');
      return theme.palette.municipalityColors?.[key] || theme.palette.primary.main;
    },
    
    // Text colors
    text: theme.palette.text,
    background: theme.palette.background,
    
    // Border colors
    border: {
      light: '#e0e0e0',
      main: '#bdbdbd',
      dark: '#757575',
    },
    
    // Shadow colors
    shadow: {
      light: 'rgba(0, 0, 0, 0.05)',
      medium: 'rgba(0, 0, 0, 0.1)',
      dark: 'rgba(0, 0, 0, 0.15)',
    },
  };
};

// Helper function to get status color
export const getStatusColor = (status, theme) => {
  const statusColors = {
    planned: theme.palette.text.secondary,
    'in-progress': theme.palette.primary.main,
    delayed: theme.palette.warning.main,
    completed: theme.palette.success.main,
    cancelled: theme.palette.error.main,
  };
  
  return statusColors[status] || theme.palette.text.secondary;
};

// Helper function to get role color
export const getRoleColor = (role, theme) => {
  const roleColors = {
    public: theme.palette.primary.main,
    contractor: theme.palette.warning.main,
    admin: theme.palette.error.main,
  };
  
  return roleColors[role] || theme.palette.text.secondary;
};

// Helper function to get municipality color
export const getMunicipalityColor = (municipality, theme) => {
  const municipalityColors = {
    bharatpur: theme.palette.primary.main,
    ratnanagar: theme.palette.success.main,
    kawasoti: theme.palette.warning.main,
    gaindakot: '#7b1fa2',
    madhyabindu: theme.palette.info.main,
  };
  
  const key = municipality?.toLowerCase().replace(/\s+/g, '');
  return municipalityColors[key] || theme.palette.primary.main;
};

// Color utility functions
export const colorUtils = {
  // Get contrasting text color
  getContrastColor: (backgroundColor) => {
    // Simple contrast calculation
    const rgb = parseInt(backgroundColor.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luma < 128 ? '#ffffff' : '#000000';
  },
  
  // Lighten color
  lightenColor: (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = (num >> 8 & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255))
      .toString(16).slice(1);
  },
  
  // Darken color
  darkenColor: (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R > 0 ? R : 0) * 0x10000 +
      (G > 0 ? G : 0) * 0x100 +
      (B > 0 ? B : 0))
      .toString(16).slice(1);
  },
};

export default useKaamHeruColors;
