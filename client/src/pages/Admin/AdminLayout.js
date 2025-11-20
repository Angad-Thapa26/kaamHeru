import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  useTheme,
  useMediaQuery,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assignment as ProjectsIcon,
  People as UsersIcon,
  Assessment as AnalyticsIcon,
  RateReview as ReviewsIcon,
  AccountCircle as AccountCircleIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../components/Branding/Logo';
import '../../styles/admin-overrides.css';

const drawerWidth = 240;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
  { text: 'Projects', icon: <ProjectsIcon />, path: '/admin/projects' },
  { text: 'Users', icon: <UsersIcon />, path: '/admin/users' },
  { text: 'Contractors', icon: <UsersIcon />, path: '/admin/contractors' },
  { text: 'Reviews', icon: <ReviewsIcon />, path: '/admin/reviews' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/admin/analytics' },
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/admin/profile' },
];

const AdminLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawer = (
    <div>
      <Toolbar>
        <Logo />
      </Toolbar>
      <Box sx={{ p: 2, textAlign: 'center', mb: 2 }}>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 'bold', 
            color: 'primary.main',
            mb: 1,
            letterSpacing: 1,
          }}
        >
          KaamHeru
        </Typography>
        <Typography 
          variant="caption" 
          component="div" 
          sx={{ 
            color: 'text.secondary',
            fontStyle: 'italic',
            p: 0,
            m: 0,
          }}
        >
          Local Government Projects
        </Typography>
      </Box>
      <Divider />
      {user && (
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap>
            {user?.fullName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.municipality}
          </Typography>
        </Box>
      )}
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText',
                  },
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
          height: 80, // Increased height
          borderRadius: 0, // Ensure no border radius
        }}
      >
        <Toolbar sx={{ minHeight: 80 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Logo 
            variant="full" 
            size="xlarge" // Extra large logo size
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/admin')}
          />
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar sx={{ minHeight: 80 }} />
        {children}
      </Box>
    </Box>
  );
};

export default AdminLayout;
