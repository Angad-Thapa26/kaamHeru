import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Paper,
  Avatar,
  LinearProgress,
  Chip,
  Divider,
} from '@mui/material';
import {
  Assignment,
  TrendingUp,
  LocationOn,
  People,
  Timeline,
  Star,
  CheckCircle,
  Pending,
  ArrowForward,
  Add,
  Assessment,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  const getRoleColor = (role) => {
    const roleColors = {
      admin: theme.palette.error.main,
      contractor: theme.palette.warning.main,
      public: theme.palette.primary.main,
    };
    return roleColors[role] || theme.palette.primary.main;
  };

  const stats = {
    public: [
      { 
        title: 'Total Projects', 
        value: '24', 
        icon: <Assignment />, 
        color: theme.palette.primary.main,
        bgColor: theme.palette.primary.light + '20',
        description: 'Projects in your municipality',
        trend: '+3 this month'
      },
      { 
        title: 'In Progress', 
        value: '8', 
        icon: <TrendingUp />, 
        color: theme.palette.info.main,
        bgColor: theme.palette.info.light + '20',
        description: 'Currently active',
        trend: '+2 this week'
      },
      { 
        title: 'Completed', 
        value: '12', 
        icon: <CheckCircle />, 
        color: theme.palette.success.main,
        bgColor: theme.palette.success.light + '20',
        description: 'Successfully finished',
        trend: '+5 this month'
      },
      { 
        title: 'My Reviews', 
        value: '3', 
        icon: <Star />, 
        color: theme.palette.warning.main,
        bgColor: theme.palette.warning.light + '20',
        description: 'Your contributions',
        trend: '+1 this week'
      },
    ],
    contractor: [
      { 
        title: 'Assigned Projects', 
        value: '5', 
        icon: <Assignment />, 
        color: theme.palette.primary.main,
        bgColor: theme.palette.primary.light + '20',
        description: 'Projects to manage',
        trend: '+1 this month'
      },
      { 
        title: 'In Progress', 
        value: '3', 
        icon: <TrendingUp />, 
        color: theme.palette.info.main,
        bgColor: theme.palette.info.light + '20',
        description: 'Currently working on',
        trend: 'On track'
      },
      { 
        title: 'Completed', 
        value: '2', 
        icon: <CheckCircle />, 
        color: theme.palette.success.main,
        bgColor: theme.palette.success.light + '20',
        description: 'Delivered successfully',
        trend: '+1 this month'
      },
      { 
        title: 'Pending Reviews', 
        value: '4', 
        icon: <Pending />, 
        color: theme.palette.warning.main,
        bgColor: theme.palette.warning.light + '20',
        description: 'Awaiting feedback',
        trend: '2 urgent'
      },
    ],
    admin: [
      { 
        title: 'Total Projects', 
        value: '45', 
        icon: <Assignment />, 
        color: theme.palette.primary.main,
        bgColor: theme.palette.primary.light + '20',
        description: 'Across all municipalities',
        trend: '+8 this month'
      },
      { 
        title: 'Active Users', 
        value: '128', 
        icon: <People />, 
        color: theme.palette.success.main,
        bgColor: theme.palette.success.light + '20',
        description: 'Registered citizens',
        trend: '+12 this week'
      },
      { 
        title: 'Contractors', 
        value: '15', 
        icon: <TrendingUp />, 
        color: theme.palette.info.main,
        bgColor: theme.palette.info.light + '20',
        description: 'Verified contractors',
        trend: '+2 this month'
      },
      { 
        title: 'Pending Reviews', 
        value: '8', 
        icon: <Assessment />, 
        color: theme.palette.warning.main,
        bgColor: theme.palette.warning.light + '20',
        description: 'Awaiting approval',
        trend: '3 high priority'
      },
    ],
  };

  const recentActivities = [
    {
      id: 1,
      title: 'Road Construction - Bharatpur to Ratnanagar',
      type: 'Project Update',
      time: '2 hours ago',
      status: 'in-progress'
    },
    {
      id: 2,
      title: 'Water Supply System Maintenance',
      type: 'New Review',
      time: '5 hours ago',
      status: 'completed'
    },
    {
      id: 3,
      title: 'Public Park Development',
      type: 'Project Created',
      time: '1 day ago',
      status: 'planned'
    },
  ];

  const currentStats = stats[user?.role] || stats.public;

  const getWelcomeMessage = () => {
    switch (user?.role) {
      case 'admin':
        return 'Admin Dashboard';
      case 'contractor':
        return 'Contractor Dashboard';
      default:
        return 'Public Dashboard';
    }
  };

  const getRoleLabel = (role) => {
    const roleLabels = {
      admin: 'Administrator',
      contractor: 'Contractor',
      public: 'Citizen'
    };
    return roleLabels[role] || 'Citizen';
  };

  const getStatusColor = (status) => {
    const colors = {
      'planned': theme.palette.text.secondary,
      'in-progress': theme.palette.info.main,
      'completed': theme.palette.success.main,
      'delayed': theme.palette.warning.main,
    };
    return colors[status] || theme.palette.text.secondary;
  };

  const handleViewProjects = () => {
    if (user?.role === 'contractor') {
      navigate('/contractor/projects');
    } else if (user?.role === 'admin') {
      navigate('/admin/projects');
    } else {
      navigate('/projects');
    }
  };

  return (
    <Box sx={{ 
      background: `linear-gradient(135deg, ${theme.palette.background.default} 0%, ${theme.palette.background.paper} 100%)`,
      minHeight: '100vh',
      p: { xs: 2, sm: 3 }
    }}>
      {/* Welcome Section */}
      <Box sx={{ 
        mb: 4,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 2
      }}>
        <Box>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{ 
              fontWeight: 600,
              color: theme.palette.primary.main,
              mb: 1,
              fontSize: { xs: '2rem', md: '2.5rem' }
            }}
          >
            Welcome back, {user?.fullName}!
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ fontWeight: 400 }}
            >
              {getWelcomeMessage()}
            </Typography>
            <Chip
              label={getRoleLabel(user?.role)}
              size="small"
              sx={{
                backgroundColor: getRoleColor(user?.role) + '20',
                color: getRoleColor(user?.role),
                fontWeight: 500
              }}
            />
            <Typography 
              variant="body2" 
              color="text.secondary"
              sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
            >
              <LocationOn fontSize="small" />
              {user?.municipality}
            </Typography>
          </Box>
        </Box>
        
        <Avatar
          sx={{
            width: 64,
            height: 64,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
            color: 'white',
            fontSize: '1.5rem',
            fontWeight: 600
          }}
        >
          {user?.fullName?.charAt(0).toUpperCase()}
        </Avatar>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {currentStats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: `0 12px 24px ${theme.palette.shadow?.medium || 'rgba(0, 0, 0, 0.1)'}`,
                  borderColor: stat.color + '40',
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: `linear-gradient(90deg, ${stat.color} 0%, ${stat.color}80 100%)`,
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box
                    sx={{
                      backgroundColor: stat.bgColor,
                      color: stat.color,
                      borderRadius: 2,
                      p: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Chip
                    label={stat.trend}
                    size="small"
                    sx={{
                      backgroundColor: stat.color + '10',
                      color: stat.color,
                      fontSize: '0.75rem',
                      fontWeight: 500
                    }}
                  />
                </Box>
                
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    fontWeight: 700,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    fontSize: '2rem'
                  }}
                >
                  {stat.value}
                </Typography>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 600,
                    color: theme.palette.text.primary,
                    mb: 0.5,
                    fontSize: '1rem'
                  }}
                >
                  {stat.title}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: theme.palette.text.secondary,
                    fontSize: '0.875rem'
                  }}
                >
                  {stat.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Content Sections */}
      <Grid container spacing={3}>
        {/* Recent Activity */}
        <Grid item xs={12} md={8}>
          <Paper 
            sx={{ 
              p: 3,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
                Recent Activity
              </Typography>
              <Button 
                size="small" 
                endIcon={<ArrowForward />}
                sx={{ textTransform: 'none' }}
              >
                View All
              </Button>
            </Box>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivities.map((activity, index) => (
                <Box key={activity.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        backgroundColor: getStatusColor(activity.status),
                      }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {activity.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">
                          {activity.type}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {activity.time}
                        </Typography>
                      </Box>
                    </Box>
                    <Chip
                      label={activity.status.replace('-', ' ')}
                      size="small"
                      sx={{
                        backgroundColor: getStatusColor(activity.status) + '20',
                        color: getStatusColor(activity.status),
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  {index < recentActivities.length - 1 && (
                    <Divider sx={{ mt: 2, borderColor: theme.palette.divider }} />
                  )}
                </Box>
              ))}
            </Box>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper 
            sx={{ 
              p: 3,
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.text.primary, mb: 3 }}>
              Quick Actions
            </Typography>
            
            <Box display="flex" flexDirection="column" gap={2}>
              <Button
                variant="contained"
                startIcon={<Assignment />}
                onClick={handleViewProjects}
                sx={{
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 500,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.light} 100%)`,
                  '&:hover': {
                    background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.main} 90%)`,
                  }
                }}
              >
                View Projects
              </Button>
              
              {user?.role === 'public' && (
                <Button
                  variant="outlined"
                  startIcon={<Star />}
                  onClick={() => navigate('/projects')}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: theme.palette.primary.main + '08',
                    }
                  }}
                >
                  Submit Review
                </Button>
              )}
              
              {user?.role === 'contractor' && (
                <Button
                  variant="outlined"
                  startIcon={<Timeline />}
                  onClick={() => navigate('/contractor/updates')}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: theme.palette.primary.main + '08',
                    }
                  }}
                >
                  Add Update
                </Button>
              )}
              
              {user?.role === 'admin' && (
                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => navigate('/admin/projects')}
                  sx={{
                    py: 1.5,
                    textTransform: 'none',
                    fontWeight: 500,
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.dark,
                      backgroundColor: theme.palette.primary.main + '08',
                    }
                  }}
                >
                  Create Project
                </Button>
              )}
            </Box>
            
            <Box sx={{ mt: 3, p: 2, backgroundColor: theme.palette.background.default, borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Need help?
              </Typography>
              <Button variant="text" size="small" sx={{ p: 0, textTransform: 'none' }}>
                View Documentation →
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
