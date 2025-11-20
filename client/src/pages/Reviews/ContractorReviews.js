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
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  Comment as CommentIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import api from '../../services/api';
import { reviewsAPI, projectsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ReviewCard = ({ review }) => {
  const [imageError, setImageError] = useState(false);
  const theme = useTheme();
  const name = 'Anonymous User';
  const initial = name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <Card
      sx={{
        mb: 2,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: 3 }
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            src={review.reviewer?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=EEE&color=555`}
            alt={name}
          >
            {initial}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.createdAt && formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              <Rating value={review.rating} readOnly size="small" />
            </Box>

            <Typography variant="body2" sx={{ mt: 1 }}>
              {review.comment}
            </Typography>

            {review.images && review.images.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1.5 }}>
                {review.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={imageError ? '/placeholder.png' : image}
                    alt={`Review image ${index + 1}`}
                    onError={() => setImageError(true)}
                    sx={{
                      width: 88,
                      height: 88,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  />
                ))}
              </Box>
            )}

            {review.project && (
              <Chip 
                label={review.project.title} 
                size="small" 
                variant="outlined" 
                sx={{ mt: 1.5 }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const StatsCard = ({ title, value, icon }) => {
  const theme = useTheme();
  return (
    <Paper
      sx={{
        p: 2.5,
        textAlign: 'center',
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: 1, color: theme.palette.text.secondary }}>{icon}</Box>
      <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Paper>
  );
};

const ContractorReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    totalProjects: 0
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchData = async () => {
    try {
      // Fetch contractor's reviews
      const reviewsResponse = await reviewsAPI.getContractorReviews();
      const reviewsData = reviewsResponse.data?.data?.reviews || reviewsResponse.data?.reviews || [];
      setReviews(reviewsData);

      // Fetch contractor's projects (by logged-in contractor ID)
      const projectsResponse = await projectsAPI.getContractorProjects(user._id);
      const projectsData = projectsResponse.data?.data?.projects || projectsResponse.data?.projects || [];
      setProjects(projectsData);

      // Calculate stats
      const totalReviews = reviewsData.length;
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      setStats({
        totalReviews,
        averageRating: averageRating.toFixed(1),
        totalProjects: projectsData.length
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

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Loading your reviews...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Reviews & Feedback
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Track your performance and client feedback in a simple, clear layout
        </Typography>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Total Reviews"
            value={stats.totalReviews}
            icon={<CommentIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Average Rating"
            value={stats.averageRating}
            icon={<StarIcon />}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <StatsCard
            title="Projects"
            value={stats.totalProjects}
            icon={<TrendingUpIcon />}
          />
        </Grid>
      </Grid>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} centered>
          <Tab label="All Reviews" />
          <Tab label="By Project" />
        </Tabs>
        <Divider />
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Box>
          {reviews.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No reviews yet
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Reviews will appear here once clients start reviewing your work.
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
        <Box>
          {projects.length === 0 ? (
            <Paper sx={{ p: 6, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No projects assigned
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Projects will appear here once you're assigned to work on them.
              </Typography>
            </Paper>
          ) : (
            projects.map((project) => {
              const projectReviews = reviews.filter(review => review.project?._id === project._id);
              const avgRating = projectReviews.length > 0 
                ? projectReviews.reduce((sum, review) => sum + review.rating, 0) / projectReviews.length 
                : 0;

              return (
                <Card key={project._id} sx={{ mb: 3 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {project.title}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={avgRating} readOnly size="small" precision={0.1} />
                        <Typography variant="body2" color="text.secondary">
                          ({projectReviews.length} reviews)
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {project.description?.substring(0, 150)}...
                    </Typography>
                    
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Reviews for this project:
                    </Typography>
                    
                    {projectReviews.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                        No reviews yet for this project.
                      </Typography>
                    ) : (
                      projectReviews.map((review) => (
                        <ReviewCard key={review._id} review={review} />
                      ))
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </Box>
      )}
    </Box>
  );
};

export default ContractorReviews;
