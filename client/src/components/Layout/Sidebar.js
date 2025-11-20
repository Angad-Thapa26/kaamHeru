import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  Assignment,
  People,
  RateReview,
  Update,
  AccountCircle,
  Assessment,
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ drawerWidth }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Don't render anything while loading
  if (loading || !user) {
    return null;
  }

  const menuItems = {
    public: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Projects', icon: <Assignment />, path: '/projects' },
      { text: 'My Reviews', icon: <RateReview />, path: '/reviews' },
      { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
    ],
    contractor: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/contractor/dashboard' },
      { text: 'My Projects', icon: <Assignment />, path: '/contractor/projects' },
      { text: 'Project Updates', icon: <Update />, path: '/contractor/updates' },
      { text: 'Reviews & Feedback', icon: <RateReview />, path: '/contractor/reviews' },
      { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
    ],
    admin: [
      { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
      { text: 'Projects', icon: <Assignment />, path: '/admin/projects' },
      { text: 'Users', icon: <People />, path: '/admin/users' },
      { text: 'Contractors', icon: <People />, path: '/admin/contractors' },
      { text: 'Reviews', icon: <RateReview />, path: '/admin/reviews' },
      { text: 'Analytics', icon: <Assessment />, path: '/admin/analytics' },
      { text: 'Profile', icon: <AccountCircle />, path: '/profile' },
    ],
  };

  const currentMenuItems = menuItems[user.role] || menuItems.public;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
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
        <Divider />
        <List>
          {currentMenuItems.map((item) => (
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
      </Box>
    </Drawer>
  );
};

export default Sidebar;
