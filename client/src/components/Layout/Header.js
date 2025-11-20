import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Badge,
} from '@mui/material';
import {
  AccountCircle,
  Dashboard,
  Logout,
  Settings,
  Notifications,
} from '@mui/icons-material';

import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Branding/Logo';

const Header = ({ drawerWidth }) => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleProfile = () => {
    navigate('/profile');
    handleMenuClose();
  };

  const handleDashboard = () => {
    // Navigate based on user role
    if (user?.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user?.role === 'contractor') {
      navigate('/contractor/dashboard');
    } else {
      navigate('/dashboard');
    }
    handleMenuClose();
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        borderBottom: 'none',
        height: 80, // Increased height
        borderRadius: 0, // Ensure no border radius
      }}
    >
      <Toolbar sx={{ minHeight: 80 }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
          <Logo 
            variant="full" 
            size="xlarge" // Extra large logo size
            sx={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
        </Box>

        {!user ? (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" variant="outlined" component={Link} to="/register">
              Register
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton color="inherit">
              <Badge badgeContent={0} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              {user.profileImage ? (
                <Avatar src={user.profileImage} alt={user.fullName} sx={{ width: 32, height: 32 }} />
              ) : (
                <AccountCircle />
              )}
            </IconButton>

            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleDashboard}>
                <Dashboard sx={{ mr: 1 }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleProfile}>
                <AccountCircle sx={{ mr: 1 }} />
                Profile
              </MenuItem>
              {user.role === 'admin' && (
                <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>
                  <Settings sx={{ mr: 1 }} />
                  Admin Panel
                </MenuItem>
              )}
              <MenuItem onClick={handleLogout}>
                <Logout sx={{ mr: 1 }} />
                Logout
              </MenuItem>
            </Menu>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
