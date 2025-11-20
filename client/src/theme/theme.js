import { createTheme } from '@mui/material/styles';
import colors from './colors';

// KaamHeru Professional Theme
const theme = createTheme({
  palette: {
    mode: 'light',
    
    // Primary colors - Professional Blue
    primary: {
      main: colors.primary[500],
      light: colors.primary[400],
      dark: colors.primary[600],
      contrastText: '#ffffff',
    },
    
    // Secondary colors - Professional Gray
    secondary: {
      main: colors.secondary[500],
      light: colors.secondary[400],
      dark: colors.secondary[600],
      contrastText: '#ffffff',
    },
    
    // Background colors - Clean White/Light Gray
    background: colors.background,
    
    // Surface colors
    surface: colors.surface,
    
    // Text colors
    text: colors.text,
    
    // Status colors
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    info: colors.info,
    
    // Custom colors for project status
    projectStatus: colors.projectStatus,
    roleColors: colors.roles,
    municipalityColors: colors.municipalities,
    
    // Gradient definitions
    gradients: colors.gradients,
    
    // Shadow and border colors
    shadow: colors.shadow,
    border: colors.border,
  },
  
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      color: colors.primary[500],
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      color: colors.primary[500],
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      color: colors.primary[500],
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: colors.text.primary,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: colors.text.primary,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      color: colors.text.primary,
      lineHeight: 1.6,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
      color: colors.text.primary,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
      color: colors.text.secondary,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  
  // Component styling
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(25, 118, 210, 0.2)',
          },
        },
        contained: {
          background: colors.gradients.primary,
          '&:hover': {
            background: `linear-gradient(45deg, ${colors.primary[600]} 30%, ${colors.primary[500]} 90%)`,
          },
        },
        outlined: {
          borderColor: colors.primary[500],
          color: colors.primary[500],
          '&:hover': {
            borderColor: colors.primary[600],
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
      },
    },
    
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: `0 2px 8px ${colors.shadow.medium}`,
          border: `1px solid ${colors.border.light}`,
          '&:hover': {
            boxShadow: `0 4px 16px ${colors.shadow.dark}`,
          },
        },
      },
    },
    
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundImage: 'none',
        },
        elevation1: {
          boxShadow: `0 2px 8px ${colors.shadow.light}`,
        },
        elevation2: {
          boxShadow: `0 4px 16px ${colors.shadow.medium}`,
        },
        elevation3: {
          boxShadow: `0 6px 24px ${colors.shadow.dark}`,
        },
      },
    },
    
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[500],
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: colors.primary[500],
              borderWidth: 2,
            },
          },
        },
      },
    },
    
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          fontWeight: 500,
        },
      },
    },
    
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          color: colors.text.primary,
          boxShadow: `0 2px 8px ${colors.shadow.light}`,
          borderBottom: `1px solid ${colors.border.light}`,
        },
      },
    },
    
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: colors.background.paper,
          borderRight: `1px solid ${colors.border.light}`,
        },
      },
    },
    
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '2px 8px',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.08)',
          },
          '&.Mui-selected': {
            backgroundColor: 'rgba(25, 118, 210, 0.12)',
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.16)',
            },
          },
        },
      },
    },
    
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.875rem',
          minHeight: 48,
        },
      },
    },
    
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: colors.surface.variant,
          '& .MuiTableCell-head': {
            color: colors.secondary[500],
            fontWeight: 600,
            fontSize: '0.875rem',
          },
        },
      },
    },
    
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)',
          },
        },
      },
    },
  },
  
  // Custom breakpoints for responsive design
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
});

export default theme;
