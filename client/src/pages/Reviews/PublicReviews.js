import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Rating,
  Chip,
  CircularProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Image as ImageIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
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
                  {review.createdAt && formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                </Typography>
              </Box>
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
            
            <Rating value={review.rating} readOnly size="small" sx={{ mb: 1 }} />
            
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
            
            {review.project && (
              <Chip 
                label={review.project.title} 
                size="small" 
                variant="outlined" 
                sx={{ mt: 2 }}
              />
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
  const { user } = useAuth();

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
    const newImage = '/api/placeholder/300/200';
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

const PublicReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchReviews();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchReviews = async () => {
    try {
      const response = await reviewsAPI.getUserReviews(user?._id);
      const reviewsData = response.data?.data?.reviews || response.data?.reviews || [];
      setReviews(reviewsData);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError('Failed to fetch reviews');
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
        images: reviewData.images || []
      };

      console.log('Submitting review with payload:', payload);

      if (editingReview) {
        await reviewsAPI.updateReview(editingReview._id, payload);
      } else {
        await reviewsAPI.createReview(payload);
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
    setEditingReview(review);
    setDialogOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await reviewsAPI.deleteReview(reviewId);
      fetchReviews();
    } catch (err) {
      console.error('Failed to delete review:', err);
      setError('Failed to delete review');
    }
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
      <Box sx={{ 
        mb: 4,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 4,
        borderRadius: 2,
        color: 'white',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)'
      }}>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
          My Reviews
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Manage and view all the reviews you've written
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setEditingReview(null);
            setDialogOpen(true);
          }}
        >
          Write New Review
        </Button>
      </Paper>

      {reviews.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            You haven't written any reviews yet
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Start by reviewing projects you've interacted with!
          </Typography>
        </Paper>
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review._id}
            review={review}
            onEdit={handleEditReview}
            onDelete={handleDeleteReview}
            canEdit={true}
          />
        ))
      )}

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
    </Box>
  );
};

export default PublicReviews;
