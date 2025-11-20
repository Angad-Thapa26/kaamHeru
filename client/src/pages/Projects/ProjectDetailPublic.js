import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Drawer,
  IconButton,
} from '@mui/material';
import {
  LocationOn,
  CalendarToday,
  AttachMoney,
  TrendingUp,
  Close as CloseIcon,
  Business,
  Phone,
  Email,
  Person,
  Work,
  Verified,
  LocationCity,
  Badge,
} from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import api, { updatesAPI } from '../../services/api';
import ProjectReviews from '../../components/Reviews/ProjectReviews';

const statusColors = {
  planning: 'warning',
  in_progress: 'info',
  completed: 'success',
  delayed: 'error',
  cancelled: 'default',
};

const ProjectDetailPublic = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [updates, setUpdates] = useState([]);
  const [updatesLoading, setUpdatesLoading] = useState(true);
  const [updatesError, setUpdatesError] = useState('');

  useEffect(() => {
    fetchProject();
    fetchUpdates();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProject = async () => {
    try {
      const res = await api.get(`/projects/${id}`);
      setProject(res.data.data?.project || null);
    } catch (err) {
      setError('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const fetchUpdates = async () => {
    try {
      const res = await updatesAPI.getProjectUpdates(id, { limit: 10 });
      setUpdates(res.data?.data?.updates || []);
    } catch (err) {
      setUpdatesError('Failed to load project updates');
    } finally {
      setUpdatesLoading(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ 
        p: 6, 
        textAlign: 'center',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: '1px solid rgba(102, 126, 234, 0.1)',
        borderRadius: 2
      }}>
        <CircularProgress sx={{ color: 'primary.main' }} />
        <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
          Loading project details...
        </Typography>
      </Paper>
    );
  }

  if (error || !project) {
    return (
      <Paper sx={{ 
        p: 4, 
        textAlign: 'center',
        background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
        border: '2px dashed rgba(244, 67, 54, 0.3)',
        borderRadius: 2
      }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Project not found'}
        </Alert>
        <Typography variant="body2" color="text.secondary">
          Please check the project ID and try again.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      {/* Hero Header Section */}
      <Box sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 4,
        borderRadius: 2,
        color: 'white',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
            {project.title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <Chip
              label={project.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              sx={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.2)', 
                color: 'white',
                fontWeight: 'bold',
                '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.3)' }
              }}
            />
            <Chip
              label={project.municipality}
              variant="outlined"
              sx={{ 
                borderColor: 'rgba(255, 255, 255, 0.5)', 
                color: 'white',
                '&:hover': { borderColor: 'rgba(255, 255, 255, 0.8)' }
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Left Column - Main Info */}
        <Grid item xs={12} lg={8}>
          {/* Description Card */}
          <Paper 
            sx={{ 
              p: 4, 
              mb: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: 2,
              position: 'relative'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography variant="h6" sx={{ color: 'white' }}>📝</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Project Overview
              </Typography>
            </Box>
            <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, fontSize: '1.1rem', color: 'text.primary' }}>
              {project.description}
            </Typography>
            
            {/* Contractor Details */}
            <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2, border: '1px solid rgba(102, 126, 234, 0.1)' }}>
              <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center' }}>
                👷 Assigned Contractor
              </Typography>
              {project.assignedContractor ? (
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Company Name:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.contractorDetails?.companyName || 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Contractor:
                    </Typography>
                    <Button
                      variant="text"
                      sx={{ 
                        p: 0, 
                        textAlign: 'left', 
                        justifyContent: 'flex-start',
                        fontWeight: 'medium',
                        color: 'primary.main',
                        '&:hover': {
                          backgroundColor: 'transparent',
                          textDecoration: 'underline'
                        }
                      }}
                      onClick={() => setDrawerOpen(true)}
                    >
                      {project.assignedContractor.fullName || 'N/A'}
                    </Button>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Email:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.email || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Contractor ID:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.contractorDetails?.contractorId || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Phone:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.phoneNumber || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Address:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.address || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Municipality:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.municipality || 'Not provided'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Specialization:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.contractorDetails?.specialization?.join(', ') || project.category || 'General'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Experience:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.contractorDetails?.experience ? `${project.assignedContractor.contractorDetails.experience} years` : 'Not specified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Verification Status:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.contractorDetails?.isVerified ? '✅ Verified' : '⏳ Not Verified'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Completed Projects:
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 'medium', mb: 2 }}>
                      {project.assignedContractor.contractorDetails?.completedProjects || 0}
                    </Typography>
                  </Grid>
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 3 }}>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
                    No contractor has been assigned to this project yet.
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Contractors will be assigned during the project planning phase.
                  </Typography>
                </Box>
              )}
            </Box>
            
            {project.tags && project.tags.length > 0 && (
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle1" sx={{ color: 'text.primary', fontWeight: 'bold', mb: 2 }}>
                  🏷️ Project Tags
                </Typography>
                <Box>
                  {project.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontSize: '0.8rem',
                        '&:hover': {
                          backgroundColor: 'primary.light',
                          color: 'primary.dark'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Paper>

          {/* Updates Card */}
          <Paper 
            sx={{ 
              p: 4, 
              mb: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography variant="h6" sx={{ color: 'white' }}>📰</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Project Updates
              </Typography>
            </Box>

            {updatesLoading ? (
              <Box sx={{ textAlign: 'center', py: 3 }}>
                <CircularProgress size={24} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Loading updates...
                </Typography>
              </Box>
            ) : updatesError ? (
              <Alert severity="error">
                {updatesError}
              </Alert>
            ) : updates.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                No updates have been posted for this project yet.
              </Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {updates.map((update) => (
                  <Box
                    key={update._id}
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid rgba(0, 0, 0, 0.08)',
                      backgroundColor: 'background.paper',
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {update.title}
                      </Typography>
                      <Chip
                        label={update.updateType}
                        size="small"
                        sx={{
                          backgroundColor: 'action.hover',
                          color: 'text.secondary',
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      {update.description}
                    </Typography>
                    {update.images && update.images.length > 0 && (
                      <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                        {update.images.map((img, idx) => (
                          <Box
                            key={idx}
                            component="img"
                            src={img}
                            alt={`Update ${idx + 1}`}
                            sx={{
                              width: 80,
                              height: 80,
                              objectFit: 'cover',
                              borderRadius: 1,
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                            }}
                          />
                        ))}
                      </Box>
                    )}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        {update.updatedBy?.fullName || update.updatedBy?.username || 'Unknown'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {update.createdAt
                          ? formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })
                          : ''}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>

          {/* Timeline Card */}
          <Paper 
            sx={{ 
              p: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography variant="h6" sx={{ color: 'white' }}>📅</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Project Timeline
              </Typography>
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(33, 150, 243, 0.2)'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                    🚀 Start Date
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {new Date(project.timeline.startDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ 
                  p: 3, 
                  background: 'linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.2)'
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.9rem' }}>
                    🎯 End Date
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                    {new Date(project.timeline.endDate).toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Right Column - Status & Details */}
        <Grid item xs={12} lg={4}>
          {/* Status Card */}
          <Paper 
            sx={{ 
              p: 4, 
              mb: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography variant="h6" sx={{ color: 'white' }}>📊</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Status
              </Typography>
            </Box>
            <Chip
              label={project.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              color={statusColors[project.status] || 'default'}
              sx={{ 
                mb: 3,
                fontWeight: 'bold',
                fontSize: '0.9rem',
                padding: '6px 16px'
              }}
            />
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Current phase: {project.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Not specified'}
              </Typography>
            </Box>
            <Box sx={{ pt: 2, borderTop: '1px solid rgba(0, 0, 0, 0.1)' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                💰 Budget: NPR {project.budget.allocated?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                💸 Spent: NPR {project.budget.spent?.toLocaleString()}
              </Typography>
            </Box>
          </Paper>

          {/* Location Card */}
          <Paper 
            sx={{ 
              p: 4, 
              mb: 3,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
              border: '1px solid rgba(102, 126, 234, 0.1)',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
              borderRadius: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Box sx={{ 
                width: 40, 
                height: 40, 
                borderRadius: '50%', 
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2
              }}>
                <Typography variant="h6" sx={{ color: 'white' }}>📍</Typography>
              </Box>
              <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                Location
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                🏛️ Municipality
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
                {project.municipality}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                📍 Specific Location
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.primary' }}>
                {project.location}
              </Typography>
            </Box>
          </Paper>

          {/* Contractor Card */}
          {project.assignedContractor && (
            <Paper 
              sx={{ 
                p: 4,
                background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
                border: '1px solid rgba(102, 126, 234, 0.1)',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  backgroundColor: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2
                }}>
                  <Typography variant="h6" sx={{ color: 'white' }}>👷</Typography>
                </Box>
                <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                  Contractor
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'text.primary' }}>
                  {project.assignedContractor.fullName}
                </Typography>
                {project.assignedContractor.contractorDetails?.companyName && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    🏢 {project.assignedContractor.contractorDetails.companyName}
                  </Typography>
                )}
              </Box>
              {project.assignedContractor.contractorDetails?.contractorId && (
                <Chip
                  label={`ID: ${project.assignedContractor.contractorDetails.contractorId}`}
                  variant="outlined"
                  size="small"
                  sx={{ 
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    fontSize: '0.8rem'
                  }}
                />
              )}
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Reviews Section */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>
          Reviews & Feedback
        </Typography>
        <ProjectReviews projectId={id} />
      </Box>

      {/* Contractor Details Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            width: 450,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {project?.assignedContractor && (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Drawer Header */}
            <Box sx={{ 
              p: 3, 
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', color: 'white' }}>
                Contractor Profile
              </Typography>
              <IconButton 
                onClick={() => setDrawerOpen(false)} 
                sx={{ 
                  color: 'white',
                  '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Scrollable Content */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
              {/* Contractor Profile Card */}
              <Paper 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 2,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      fontSize: '2.5rem',
                      fontWeight: 'bold',
                      boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    {project.assignedContractor.fullName?.charAt(0) || 'C'}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1a237e', mb: 1 }}>
                    {project.assignedContractor.fullName}
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#5e35b1', mb: 2, fontWeight: 'medium' }}>
                    {project.assignedContractor.contractorDetails?.companyName || 'Company Name Not Specified'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 2 }}>
                    <Chip
                      label={project.assignedContractor.contractorDetails?.isVerified ? '✅ Verified' : '⏳ Not Verified'}
                      color={project.assignedContractor.contractorDetails?.isVerified ? 'success' : 'warning'}
                      size="small"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <Chip
                      label={`${project.assignedContractor.contractorDetails?.experience || 0} Years Experience`}
                      variant="outlined"
                      size="small"
                      sx={{ borderColor: '#667eea', color: '#667eea' }}
                    />
                  </Box>
                </Box>
              </Paper>

              {/* Contact Information Card */}
              <Paper 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#1a237e', display: 'flex', alignItems: 'center' }}>
                  <Email sx={{ mr: 2, color: '#667eea' }} />
                  Contact Information
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                  }}>
                    <Email sx={{ mr: 2, color: '#667eea', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {project.assignedContractor.email || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                  }}>
                    <Phone sx={{ mr: 2, color: '#667eea', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Phone
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {project.assignedContractor.phoneNumber || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                  }}>
                    <LocationOn sx={{ mr: 2, color: '#667eea', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Address
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {project.assignedContractor.address || 'Not provided'}, {project.assignedContractor.municipality || 'Not provided'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Professional Details Card */}
              <Paper 
                sx={{ 
                  p: 3, 
                  mb: 3,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 3,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#1a237e', display: 'flex', alignItems: 'center' }}>
                  <Business sx={{ mr: 2, color: '#667eea' }} />
                  Professional Details
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                  }}>
                    <Badge sx={{ mr: 2, color: '#667eea', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Contractor ID
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {project.assignedContractor.contractorDetails?.contractorId || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                  }}>
                    <Work sx={{ mr: 2, color: '#667eea', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Experience
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {project.assignedContractor.contractorDetails?.experience ? `${project.assignedContractor.contractorDetails.experience} years` : 'Not specified'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                  }}>
                    <Business sx={{ mr: 2, color: '#667eea', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Specialization
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {project.assignedContractor.contractorDetails?.specialization?.join(', ') || 'General'}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    p: 2, 
                    bgcolor: '#f5f5f5',
                    borderRadius: 2
                  }}>
                    <TrendingUp sx={{ mr: 2, color: '#667eea', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                        Completed Projects
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                        {project.assignedContractor.contractorDetails?.completedProjects || 0}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>

              {/* Verification Badge */}
              {project.assignedContractor.contractorDetails?.isVerified && (
                <Paper 
                  sx={{ 
                    p: 3,
                    background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)',
                    borderRadius: 3,
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
                  }}
                >
                  <Verified sx={{ fontSize: 48, mb: 2, color: 'white' }} />
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                    Verified Contractor
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                    Verified by {project.assignedContractor.contractorDetails.verifiedBy || 'Admin'}
                  </Typography>
                </Paper>
              )}
            </Box>
          </Box>
        )}
      </Drawer>
    </Box>
  );
};

export default ProjectDetailPublic;
