import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Comment as CommentIcon,
  FilterList as FilterIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import { reviewsAPI } from '../../services/api';

const ReviewCard = ({ review }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card sx={{ mb: 2, transition: 'all 0.2s ease', '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            src={review.reviewer?.profileImage || `https://ui-avatars.com/api/?name=${review.reviewer?.fullName || 'User'}&background=random`}
            alt={review.reviewer?.fullName}
          >
            {review.reviewer?.fullName?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  {review.reviewer?.fullName || 'Anonymous User'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.reviewer?.email}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ ml: 2 }}>
                  {review.createdAt && formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={review.rating} readOnly size="small" />
                <Chip 
                  label={review.reviewer?.role || 'user'} 
                  size="small" 
                  color="primary" 
                  variant="outlined"
                />
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {review.comment}
            </Typography>
            
            {review.images && review.images.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                {review.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={imageError ? '/api/placeholder/150/150' : image}
                    alt={`Review image ${index + 1}`}
                    onError={() => setImageError(true)}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer',
                      '&:hover': { transform: 'scale(1.05)' },
                      transition: 'transform 0.2s ease'
                    }}
                  />
                ))}
              </Box>
            )}
            
            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
              {review.project && (
                <Chip 
                  label={`Project: ${review.project.title}`} 
                  size="small" 
                  variant="outlined"
                />
              )}
              {review.contractor && (
                <Chip 
                  label={`Contractor: ${review.contractor.fullName}`} 
                  size="small" 
                  variant="outlined"
                  color="secondary"
                />
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const StatsCard = ({ title, value, icon }) => (
  <Paper
    sx={{
      p: 3,
      textAlign: 'center',
      backgroundColor: 'background.paper',
      border: '1px solid rgba(0, 0, 0, 0.06)',
      borderRadius: 2,
    }}
  >
    <Box sx={{ mb: 1, color: 'text.secondary' }}>{icon}</Box>
    <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
      {value}
    </Typography>
    <Typography variant="body2" color="text.secondary">
      {title}
    </Typography>
  </Paper>
);

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [filters, setFilters] = useState({
    project: '',
    contractor: '',
    rating: '',
    dateRange: ''
  });
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    totalProjects: 0,
    totalContractors: 0
  });

  useEffect(() => {
    fetchData();
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      // Fetch all reviews with filters
      const params = new URLSearchParams();
      if (filters.project) params.append('project', filters.project);
      if (filters.contractor) params.append('contractor', filters.contractor);
      if (filters.rating) params.append('rating', filters.rating);
      
      const reviewsResponse = await reviewsAPI.getAllReviews(params);
      const reviewsData = reviewsResponse.data?.data?.reviews || reviewsResponse.data?.reviews || [];
      setReviews(reviewsData);

      // Fetch all projects
      const projectsResponse = await api.get('/projects');
      const projectsData = projectsResponse.data?.data?.projects || [];
      setProjects(projectsData);

      // Fetch all contractors
      const contractorsResponse = await api.get('/users/contractors');
      const contractorsData = contractorsResponse.data?.data?.users || [];
      setContractors(contractorsData);

      // Calculate stats
      const totalReviews = reviewsData.length;
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      setStats({
        totalReviews,
        averageRating: averageRating.toFixed(1),
        totalProjects: projectsData.length,
        totalContractors: contractorsData.length
      });
    } catch (err) {
      console.error('Failed to fetch data:', err);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleFilterChange = (field) => (event) => {
    setFilters(prev => ({ ...prev, [field]: event.target.value }));
  };

  const clearFilters = () => {
    setFilters({
      project: '',
      contractor: '',
      rating: '',
      dateRange: ''
    });
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Loading reviews data...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Box
        sx={{
          mb: 4,
          p: 4,
          borderRadius: 2,
          backgroundColor: 'background.paper',
          border: '1px solid rgba(0, 0, 0, 0.06)',
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: 'text.primary' }}>
          Review Management
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Monitor and analyze all project reviews and contractor performance
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={<CommentIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Average Rating"
            value={stats.averageRating}
            icon={<StarIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={<TrendingUpIcon />}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatsCard
            title="Total Contractors"
            value={stats.totalContractors}
            icon={<TrendingUpIcon />}
          />
        </Grid>
      </Grid>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon />
          Filters
        </Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select
                value={filters.project}
                onChange={handleFilterChange('project')}
                label="Project"
              >
                <MenuItem value="">All Projects</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project._id} value={project._id}>
                    {project.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Contractor</InputLabel>
              <Select
                value={filters.contractor}
                onChange={handleFilterChange('contractor')}
                label="Contractor"
              >
                <MenuItem value="">All Contractors</MenuItem>
                {contractors.map((contractor) => (
                  <MenuItem key={contractor._id} value={contractor._id}>
                    {contractor.fullName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <FormControl fullWidth>
              <InputLabel>Rating</InputLabel>
              <Select
                value={filters.rating}
                onChange={handleFilterChange('rating')}
                label="Rating"
              >
                <MenuItem value="">All Ratings</MenuItem>
                <MenuItem value="5">5 Stars</MenuItem>
                <MenuItem value="4">4 Stars</MenuItem>
                <MenuItem value="3">3 Stars</MenuItem>
                <MenuItem value="2">2 Stars</MenuItem>
                <MenuItem value="1">1 Star</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={2}>
            <TextField
              fullWidth
              label="Date Range"
              type="date"
              value={filters.dateRange}
              onChange={handleFilterChange('dateRange')}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} md={2}>
            <Button
              variant="outlined"
              onClick={clearFilters}
              fullWidth
              sx={{ height: '56px' }}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="All Reviews" />
          <Tab label="Analytics" />
          <Tab label="Contractor Performance" />
        </Tabs>
        <Divider />
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {reviews.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No reviews found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reviews will appear here once users start reviewing projects.
              </Typography>
            </Paper>
          ) : (
            reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))
          )}
        </Box>
      )}

      {tabValue === 1 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Review Analytics
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Project</TableCell>
                  <TableCell>Reviews Count</TableCell>
                  <TableCell>Average Rating</TableCell>
                  <TableCell>Latest Review</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((project) => {
                  const projectReviews = reviews.filter(review => review.project?._id === project._id);
                  const avgRating = projectReviews.length > 0 
                    ? projectReviews.reduce((sum, review) => sum + review.rating, 0) / projectReviews.length 
                    : 0;
                  const latestReview = projectReviews[0];

                  return (
                    <TableRow key={project._id}>
                      <TableCell>{project.title}</TableCell>
                      <TableCell>{projectReviews.length}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={avgRating} readOnly size="small" precision={0.1} />
                          <Typography variant="body2">
                            {avgRating.toFixed(1)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        {latestReview ? (
                          <Typography variant="body2">
                            {formatDistanceToNow(new Date(latestReview.createdAt), { addSuffix: true })}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No reviews
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}

      {tabValue === 2 && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Contractor Performance
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Contractor</TableCell>
                  <TableCell>Total Reviews</TableCell>
                  <TableCell>Average Rating</TableCell>
                  <TableCell>Projects Completed</TableCell>
                  <TableCell>Performance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contractors.map((contractor) => {
                  const contractorReviews = reviews.filter(review => review.contractor?._id === contractor._id);
                  const avgRating = contractorReviews.length > 0 
                    ? contractorReviews.reduce((sum, review) => sum + review.rating, 0) / contractorReviews.length 
                    : 0;
                  const contractorProjects = projects.filter(project => project.assignedContractor?._id === contractor._id);
                  
                  let performance = 'No Reviews';
                  let performanceColor = 'text.secondary';
                  
                  if (avgRating >= 4.5) {
                    performance = 'Excellent';
                    performanceColor = 'success.main';
                  } else if (avgRating >= 3.5) {
                    performance = 'Good';
                    performanceColor = 'primary.main';
                  } else if (avgRating >= 2.5) {
                    performance = 'Average';
                    performanceColor = 'warning.main';
                  } else if (avgRating > 0) {
                    performance = 'Poor';
                    performanceColor = 'error.main';
                  }

                  return (
                    <TableRow key={contractor._id}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Avatar 
                            src={contractor.profileImage || `https://ui-avatars.com/api/?name=${contractor.fullName}&background=random`}
                            alt={contractor.fullName}
                            sx={{ width: 32, height: 32 }}
                          >
                            {contractor.fullName?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                              {contractor.fullName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {contractor.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{contractorReviews.length}</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating value={avgRating} readOnly size="small" precision={0.1} />
                          <Typography variant="body2">
                            {avgRating.toFixed(1)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{contractorProjects.length}</TableCell>
                      <TableCell>
                        <Typography variant="body2" color={performanceColor} sx={{ fontWeight: 'bold' }}>
                          {performance}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      )}
    </Box>
  );
};

export default AdminReviews;
