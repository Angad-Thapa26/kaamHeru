import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Grid,
  TextField,
  Button,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Profile
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box textAlign="center">
              <Avatar
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                src={user?.profileImage}
              />
              <Typography variant="h6">{user?.fullName}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username"
                  value={user?.username || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  value={user?.email || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={user?.phoneNumber || ''}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Municipality"
                  value={user?.municipality || ''}
                  disabled
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Address"
                  multiline
                  rows={2}
                  value={user?.address || ''}
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" sx={{ mr: 2 }}>
                  Update Profile
                </Button>
                <Button variant="outlined">
                  Change Password
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
