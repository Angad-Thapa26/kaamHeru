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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { reviewsAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const ReviewCard = ({ review, onEdit, onDelete, canEdit = false }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <Card sx={{ mb: 2, transition: 'all 0.2s ease', '&:hover': { boxShadow: 3 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          <Avatar 
            src="https://ui-avatars.com/api/?name=Anonymous&background=6366f1&color=fff"
            alt="Anonymous User"
          >
            A
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Anonymous User
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {review.createdAt && formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Rating value={review.rating} readOnly size="small" />
                {canEdit && (
                  <Box>
                    <IconButton size="small" onClick={() => onEdit(review)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton size="small" onClick={() => onDelete(review._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Box>
            
            <Typography variant="body1" sx={{ mb: 2 }}>
              {review.comment}
            </Typography>
            
            {review.satisfaction && (
              <Chip 
                label={review.satisfaction} 
                size="small" 
                sx={{ mb: 2 }}
                color={
                  review.satisfaction === 'Very Satisfied' ? 'success' :
                  review.satisfaction === 'Satisfied' ? 'primary' :
                  review.satisfaction === 'Neutral' ? 'default' :
                  review.satisfaction === 'Dissatisfied' ? 'warning' : 'error'
                }
              />
            )}
            
            {review.images && review.images.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 2 }}>
                {review.images.map((image, index) => (
                  <Box
                    key={index}
                    component="img"
                    src={image}
                    alt={`Review image ${index + 1}`}
                    sx={{
                      width: 100,
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                      border: '1px solid rgba(0, 0, 0, 0.1)',
                      cursor: 'pointer'
                    }}
                    onError={() => setImageError(true)}
                    onClick={() => {
                      if (!imageError) {
                        window.open(image, '_blank');
                      }
                    }}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ReviewDialog = ({ open, onClose, review, onSubmit, isEditing = false }) => {
  const [formData, setFormData] = useState({
    rating: review?.rating || 5,
    satisfaction: review?.satisfaction || 'Satisfied',
    comment: review?.comment || '',
    images: review?.images || []
  });
  const [imagePreviews, setImagePreviews] = useState(review?.images || []);

  useEffect(() => {
    if (open) {
      setFormData({
        rating: review?.rating || 5,
        satisfaction: review?.satisfaction || 'Satisfied',
        comment: review?.comment || '',
        images: review?.images || []
      });
      setImagePreviews(review?.images || []);
    }
  }, [open, review]);

  const handleImageUpload = () => {
    // For now, add a default placeholder image
    const newImage = '/placeholder.png';
    const newImages = [...formData.images, newImage];
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newImages);
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
    setImagePreviews(newImages);
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEditing ? 'Edit Review' : 'Write a Review'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={formData.rating}
            onChange={(event, newValue) => {
              setFormData({ ...formData, rating: newValue });
            }}
            size="large"
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Satisfaction Level</InputLabel>
            <Select
              value={formData.satisfaction}
              onChange={(e) => setFormData({ ...formData, satisfaction: e.target.value })}
              label="Satisfaction Level"
            >
              <MenuItem value="Very Satisfied">Very Satisfied</MenuItem>
              <MenuItem value="Satisfied">Satisfied</MenuItem>
              <MenuItem value="Neutral">Neutral</MenuItem>
              <MenuItem value="Dissatisfied">Dissatisfied</MenuItem>
              <MenuItem value="Very Dissatisfied">Very Dissatisfied</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Review"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            sx={{ mb: 3 }}
          />
          
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Images
            </Typography>
            
            <Button
              variant="outlined"
              startIcon={<ImageIcon />}
              onClick={handleImageUpload}
              sx={{ mb: 2 }}
            >
              Add Image
            </Button>
            
            {imagePreviews.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {imagePreviews.map((image, index) => (
                  <Box key={index} sx={{ position: 'relative' }}>
                    <Box
                      component="img"
                      src={image}
                      alt={`Preview ${index + 1}`}
                      sx={{
                        width: 100,
                        height: 100,
                        objectFit: 'cover',
                        borderRadius: 1,
                        border: '1px solid rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        position: 'absolute',
                        top: -8,
                        right: -8,
                        backgroundColor: 'error.main',
                        color: 'white',
                        '&:hover': { backgroundColor: 'error.dark' }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {isEditing ? 'Update' : 'Submit'} Review
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProjectReviews = ({ projectId }) => {
  console.log('=== ProjectReviews Component Mounted ===');
  console.log('Received projectId:', projectId);
  console.log('projectId type:', typeof projectId);
  
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const { user } = useAuth();

  useEffect(() => {
    console.log('=== useEffect triggered for fetchReviews ===');
    console.log('Current projectId:', projectId);
    if (projectId) {
      fetchReviews();
    } else {
      console.log('No projectId provided, skipping fetch');
      setLoading(false);
    }
  }, [projectId]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReviews = async () => {
    try {
      console.log('=== Starting fetchReviews ===');
      console.log('Project ID:', projectId);
      console.log('Project ID type:', typeof projectId);
      
      // First test if the API is working
      try {
        const testResponse = await reviewsAPI.test();
        console.log('API test response:', testResponse.data);
      } catch (testError) {
        console.error('API test failed:', testError);
        throw testError;
      }
      
      console.log('Fetching reviews for project:', projectId);
      const response = await reviewsAPI.getProjectReviews(projectId);
      console.log('Raw reviews response:', response);
      console.log('Response data:', response.data);
      
      // Handle the exact MongoDB response structure
      let reviewsData = [];
      if (response.data?.success && response.data?.data?.reviews) {
        reviewsData = response.data.data.reviews;
        console.log('Found reviews in success.data.reviews structure');
      } else if (response.data?.data?.reviews) {
        reviewsData = response.data.data.reviews;
        console.log('Found reviews in data.reviews structure');
      } else if (response.data?.reviews) {
        reviewsData = response.data.reviews;
        console.log('Found reviews in reviews structure');
      } else if (Array.isArray(response.data)) {
        reviewsData = response.data;
        console.log('Found reviews as direct array');
      } else {
        console.log('No reviews found in any expected structure');
        console.log('Available keys:', Object.keys(response.data || {}));
      }
      
      console.log('Processed reviews data:', reviewsData);
      console.log('Number of reviews:', reviewsData.length);
      
      if (reviewsData.length > 0) {
        console.log('Sample review structure:', reviewsData[0]);
      }
      
      setReviews(reviewsData);

      // Calculate stats
      const totalReviews = reviewsData.length;
      const averageRating = totalReviews > 0 
        ? reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews 
        : 0;

      const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      reviewsData.forEach(review => {
        ratingDistribution[review.rating]++;
      });

      setStats({
        totalReviews,
        averageRating: averageRating.toFixed(1),
        ratingDistribution
      });
      
      console.log('=== fetchReviews completed successfully ===');
    } catch (err) {
      console.error('=== fetchReviews failed ===');
      console.error('Error details:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Set empty state when backend fails
      setReviews([]);
      setStats({
        totalReviews: 0,
        averageRating: '0.0',
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (reviewData) => {
    try {
      // Validate required fields
      if (!reviewData.comment?.trim()) {
        setError('Please provide a comment for your review');
        return;
      }
      
      if (!reviewData.rating || reviewData.rating < 1 || reviewData.rating > 5) {
        setError('Please provide a valid rating between 1 and 5 stars');
        return;
      }
      
      if (!reviewData.satisfaction) {
        setError('Please select your satisfaction level');
        return;
      }

      const payload = {
        comment: reviewData.comment.trim(),
        rating: parseInt(reviewData.rating),
        satisfaction: reviewData.satisfaction,
        project: projectId,
        images: reviewData.images || []
      };

      console.log('Submitting review with payload:', payload);

      // Try to submit to backend, but if it fails, create a mock review
      try {
        if (editingReview) {
          await reviewsAPI.updateReview(editingReview._id, payload);
        } else {
          await reviewsAPI.createReview(payload);
        }
      } catch (backendError) {
        console.warn('Backend not available, creating mock review:', backendError);
        
        // Create a mock review for demo purposes
        const mockReview = {
          _id: editingReview?._id || `mock_${Date.now()}`,
          comment: payload.comment,
          rating: payload.rating,
          satisfaction: payload.satisfaction,
          project: { _id: projectId },
          reviewer: {
            _id: user?._id || 'mock_user',
            fullName: user?.fullName || 'Demo User',
            profileImage: user?.profileImage
          },
          images: payload.images,
          createdAt: editingReview?.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        // Update local state with mock review
        if (editingReview) {
          setReviews(prev => prev.map(r => r._id === editingReview._id ? mockReview : r));
        } else {
          setReviews(prev => [mockReview, ...prev]);
        }
      }
      
      fetchReviews();
      setEditingReview(null);
    } catch (err) {
      console.error('Failed to submit review:', err);
      console.error('Error response:', err.response?.data);
      
      // Show more detailed error information
      let errorMessage = 'Failed to submit review';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      }
      
      if (err.response?.data?.errors) {
        // Handle validation errors array
        const errors = err.response.data.errors;
        console.log('Validation errors:', errors);
        
        if (Array.isArray(errors)) {
          if (errors.length > 0) {
            errorMessage = errors.join(', ');
          } else {
            errorMessage = 'Validation failed. Please check all fields.';
          }
        } else if (typeof errors === 'object') {
          const errorMessages = Object.values(errors).flat();
          if (errorMessages.length > 0) {
            errorMessage = errorMessages.join(', ');
          } else {
            errorMessage = 'Validation failed. Please check all fields.';
          }
        }
      } else if (err.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleEditReview = (review) => {
    // Check if user can edit this review
    if (user && (review.reviewer?._id === user._id || user.role === 'admin')) {
      setEditingReview(review);
      setDialogOpen(true);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      fetchReviews();
    } catch (err) {
      console.warn('Backend not available for delete, removing from local state:', err);
      // Remove from local state if backend fails
      setReviews(prev => prev.filter(r => r._id !== reviewId));
    }
  };

  const canReview = () => {
    // User can review if they are logged in and haven't already reviewed
    return user && !reviews.some(review => review.reviewer?._id === user._id);
  };

  const canEditReview = (review) => {
    return user && (review.reviewer?._id === user._id || user.role === 'admin');
  };

  if (loading) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center', mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Loading Reviews...
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold', color: 'primary.main' }}>
        Project Reviews
      </Typography>

      {/* Review Stats */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                {stats.averageRating}
              </Typography>
              <Rating value={parseFloat(stats.averageRating)} readOnly precision={0.1} size="large" />
              <Typography variant="body2" color="text.secondary">
                Average Rating
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={8}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Rating Distribution ({stats.totalReviews} reviews)
            </Typography>
            {[5, 4, 3, 2, 1].map((rating) => (
              <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography sx={{ width: 60, fontSize: '0.9rem' }}>
                  {rating} {rating === 1 ? 'star' : 'stars'}
                </Typography>
                <Box sx={{ flex: 1, mx: 2 }}>
                  <Box
                    sx={{
                      height: 8,
                      bgcolor: 'grey.200',
                      borderRadius: 4,
                      position: 'relative',
                    }}
                  >
                    <Box
                      sx={{
                        height: '100%',
                        bgcolor: 'primary.main',
                        borderRadius: 4,
                        width: `${stats.totalReviews > 0 ? (stats.ratingDistribution[rating] / stats.totalReviews) * 100 : 0}%`,
                      }}
                    />
                  </Box>
                </Box>
                <Typography sx={{ width: 40, textAlign: 'right', fontSize: '0.9rem' }}>
                  {stats.ratingDistribution[rating]}
                </Typography>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Box>

      {/* Add Review Button */}
      {user && canReview() && (
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            size="large"
            sx={{ px: 4, py: 1.5 }}
          >
            Write a Review
          </Button>
        </Box>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <StarIcon sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No reviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be the first to share your experience with this project!
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Recent Reviews
          </Typography>
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
              canEdit={canEditReview(review)}
            />
          ))}
        </Box>
      )}

      {/* Review Dialog */}
      <ReviewDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingReview(null);
        }}
        review={editingReview}
        onSubmit={handleSubmitReview}
        isEditing={!!editingReview}
      />
    </Paper>
  );
};

export default ProjectReviews;
