import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const municipalities = [
  'Bharatpur', 'Ratnanagar', 'Kawasoti', 'Gaindakot', 'Madhyabindu',
  'Bharatpur Metropolitain', 'Ratnanagar Municipality', 'Kawasoti Municipality',
  'Gaindakot Municipality', 'Madhyabindu Municipality',
];

const statusColors = {
  planning: 'warning',
  in_progress: 'info',
  completed: 'success',
  delayed: 'error',
  cancelled: 'default',
};

const PublicProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    municipality: '',
    status: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.municipality) params.append('municipality', filters.municipality);
      if (filters.status) params.append('status', filters.status);

      const res = await api.get(`/projects?${params.toString()}`);
      setProjects(res.data.data?.projects || []);
    } catch (err) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }));
  };

  const clearFilters = () => {
    setFilters({ municipality: '', status: '' });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Loading projects...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 4,
        borderRadius: 2,
        color: 'white',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
      }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'white' }}>
          Local Government Projects
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9, color: 'white' }}>
          Browse and track development projects in your municipality
        </Typography>
      </Box>

      {/* Filters */}
      <Paper 
        sx={{ 
          p: 3, 
          mb: 3,
          background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
          🔍 Filter Projects
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: 'primary.main' }, color: 'text.primary' }}>Municipality</InputLabel>
              <Select
                value={filters.municipality}
                onChange={handleFilterChange('municipality')}
                label="Municipality"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                  }
                }}
              >
                <MenuItem value="">All Municipalities</MenuItem>
                {municipalities.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel sx={{ '&.Mui-focused': { color: 'primary.main' }, color: 'text.primary' }}>Status</InputLabel>
              <Select
                value={filters.status}
                onChange={handleFilterChange('status')}
                label="Status"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': { borderColor: 'primary.main' },
                    '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                  }
                }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="planning">Planning</MenuItem>
                <MenuItem value="in_progress">In Progress</MenuItem>
                <MenuItem value="completed">Completed</MenuItem>
                <MenuItem value="delayed">Delayed</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              fullWidth
              sx={{ 
                height: '56px',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'primary.main',
                  color: 'white'
                }
              }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Results */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {projects.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, 
            textAlign: 'center',
            background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)',
            border: '2px dashed rgba(102, 126, 234, 0.3)',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" color="text.primary" sx={{ mb: 2, fontWeight: 'light' }}>
            📋 No projects found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, mx: 'auto' }}>
            {filters.municipality || filters.status
              ? 'Try adjusting your filters to see more results.'
              : 'Projects will appear here once administrators create them.'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {projects.map((project) => (
            <Grid item xs={12} md={6} lg={4} key={project._id}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold',
                      color: 'text.primary',
                      lineHeight: 1.3
                    }}
                  >
                    {project.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ 
                      mb: 3,
                      lineHeight: 1.6,
                      fontSize: '0.95rem'
                    }}
                  >
                    {project.description?.substring(0, 150)}
                    {project.description?.length > 150 && '...'}
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label={project.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      color={statusColors[project.status] || 'default'}
                      size="small"
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        fontWeight: 'bold',
                        fontSize: '0.75rem'
                      }}
                    />
                    <Chip
                      label={project.municipality}
                      variant="outlined"
                      size="small"
                      sx={{ 
                        mr: 1, 
                        mb: 1,
                        borderColor: 'primary.main',
                        color: 'primary.main',
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      💰 <strong>Budget:</strong> NPR {project.budget.allocated?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      💸 <strong>Spent:</strong> NPR {project.budget.spent?.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      📍 <strong>Location:</strong> {project.location}
                    </Typography>
                    {project.assignedContractor && (
                      <Typography variant="body2" color="text.secondary">
                        👷 <strong>Contractor:</strong> {project.assignedContractor.fullName}
                      </Typography>
                    )}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<ViewIcon />}
                    onClick={() => navigate(`/projects/${project._id}`)}
                    variant="contained"
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'scale(1.02)'
                      },
                      transition: 'all 0.2s ease'
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default PublicProjects;
