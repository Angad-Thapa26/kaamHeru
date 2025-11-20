import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Pagination,
  Paper,
} from '@mui/material';
import { Search, LocationOn, Schedule, AttachMoney } from '@mui/icons-material';

const mockProjects = [
  {
    id: '1',
    title: 'Road Construction - Bharatpur to Ratnanagar',
    description: 'Construction of 10km road connecting Bharatpur and Ratnanagar municipalities',
    category: 'Road Construction',
    municipality: 'Bharatpur',
    status: 'In Progress',
    progress: 65,
    budget: { allocated: 5000000, spent: 3250000 },
    timeline: { startDate: '2024-01-15', endDate: '2024-12-31' },
    assignedContractor: { fullName: 'Construction Nepal Pvt. Ltd.' },
  },
  {
    id: '2',
    title: 'Water Supply Project - Kawasoti',
    description: 'Installation of water supply system for 500 households in Kawasoti',
    category: 'Water Supply',
    municipality: 'Kawasoti',
    status: 'In Progress',
    progress: 40,
    budget: { allocated: 2000000, spent: 800000 },
    timeline: { startDate: '2024-03-01', endDate: '2024-09-30' },
    assignedContractor: { fullName: 'Aqua Solutions Nepal' },
  },
  {
    id: '3',
    title: 'Community Health Post - Gaindakot',
    description: 'Construction of a new health post with modern facilities',
    category: 'Health',
    municipality: 'Gaindakot',
    status: 'Completed',
    progress: 100,
    budget: { allocated: 1500000, spent: 1450000 },
    timeline: { startDate: '2023-10-01', endDate: '2024-02-28' },
    assignedContractor: { fullName: 'BuildTech Constructors' },
  },
];

const municipalities = [
  'All',
  'Bharatpur',
  'Ratnanagar',
  'Kawasoti',
  'Gaindakot',
  'Madhyabindu',
];

const categories = [
  'All',
  'Road Construction',
  'Building Construction',
  'Water Supply',
  'Sanitation',
  'Electricity',
  'Education',
  'Health',
  'Agriculture',
  'Tourism',
];

const statusOptions = [
  'All',
  'Planned',
  'In Progress',
  'Delayed',
  'Completed',
  'Cancelled',
];

const ProjectsList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    municipality: 'All',
    category: 'All',
    status: 'All',
  });
  const [page, setPage] = useState(1);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'info';
      case 'Delayed': return 'warning';
      case 'Planned': return 'default';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'success';
    if (progress >= 50) return 'warning';
    return 'error';
  };

  const filteredProjects = mockProjects.filter(project => {
    return (
      (filters.search === '' || 
       project.title.toLowerCase().includes(filters.search.toLowerCase()) ||
       project.description.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.municipality === 'All' || project.municipality === filters.municipality) &&
      (filters.category === 'All' || project.category === filters.category) &&
      (filters.status === 'All' || project.status === filters.status)
    );
  });

  const projectsPerPage = 6;
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const paginatedProjects = filteredProjects.slice(
    (page - 1) * projectsPerPage,
    page * projectsPerPage
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Development Projects
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Browse and track development projects in your municipality
      </Typography>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              placeholder="Search projects..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              InputProps={{
                startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Municipality</InputLabel>
              <Select
                value={filters.municipality}
                label="Municipality"
                onChange={(e) => handleFilterChange('municipality', e.target.value)}
              >
                {municipalities.map((municipality) => (
                  <MenuItem key={municipality} value={municipality}>
                    {municipality}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filters.category}
                label="Category"
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filters.status}
                label="Status"
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Projects Grid */}
      <Grid container spacing={3}>
        {paginatedProjects.map((project) => (
          <Grid item xs={12} md={6} lg={4} key={project.id}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                  <Typography variant="h6" component="h2" sx={{ lineHeight: 1.2 }}>
                    {project.title}
                  </Typography>
                  <Chip
                    label={project.status}
                    color={getStatusColor(project.status)}
                    size="small"
                  />
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {project.description}
                </Typography>

                <Box display="flex" flexDirection="column" gap={1}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {project.municipality}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {project.category}
                    </Typography>
                  </Box>
                  
                  <Box display="flex" alignItems="center" gap={1}>
                    <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      Rs. {project.budget.allocated.toLocaleString()}
                    </Typography>
                  </Box>

                  {project.assignedContractor && (
                    <Typography variant="body2" color="text.secondary">
                      Contractor: {project.assignedContractor.fullName}
                    </Typography>
                  )}

                  <Box mt={1}>
                    <Typography variant="body2" gutterBottom>
                      Progress: {project.progress}%
                    </Typography>
                    <Box
                      sx={{
                        width: '100%',
                        height: 8,
                        backgroundColor: 'grey.200',
                        borderRadius: 1,
                        overflow: 'hidden',
                      }}
                    >
                      <Box
                        sx={{
                          width: `${project.progress}%`,
                          height: '100%',
                          backgroundColor: getProgressColor(project.progress) === 'success' 
                            ? '#2e7d32' 
                            : getProgressColor(project.progress) === 'warning' 
                            ? '#ed6c02' 
                            : '#d32f2f',
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {filteredProjects.length === 0 && (
        <Box textAlign="center" py={4}>
          <Typography variant="h6" color="text.secondary">
            No projects found matching your criteria
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default ProjectsList;
