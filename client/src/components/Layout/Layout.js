import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';

import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 240;

const Layout = () => {
  const { user, loading } = useAuth();

  // Don't render sidebar while loading or if no user
  if (loading) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Header drawerWidth={drawerWidth} />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: '100%',
            mt: 10, // Account for increased header height (80px)
          }}
        >
          <Container maxWidth="xl">
            <Outlet />
          </Container>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <Header drawerWidth={drawerWidth} />
      {user && <Sidebar drawerWidth={drawerWidth} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: user ? `calc(100% - ${drawerWidth}px)` : '100%',
          mt: 10, // Account for increased header height (80px)
        }}
      >
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
