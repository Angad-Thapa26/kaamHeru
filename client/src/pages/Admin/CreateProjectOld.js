import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../services/api';

const municipalities = [
  'Bharatpur', 'Ratnanagar', 'Kawasoti', 'Gaindakot', 'Madhyabindu',
  'Bharatpur Metropolitain', 'Ratnanagar Municipality', 'Kawasoti Municipality',
  'Gaindakot Municipality', 'Madhyabindu Municipality',
];

const CreateProject = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchContractors = async () => {
      try {
        const res = await api.get('/users?role=contractor');
        setContractors(res.data.data?.users || []);
      } catch (err) {
        console.error('Failed to fetch contractors:', err);
        toast.error('Failed to load contractors');
      } finally {
        setLoadingContractors(false);
      }
    };
    fetchContractors();
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      const payload = {
        ...data,
        budget: parseFloat(data.budget),
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
        status: 'planning',
      };
      await api.post('/projects', payload);
      toast.success('Project created successfully!');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create project');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Create New Project
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Local government projects will be visible to the public once created.
      </Typography>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Project Title"
              {...register('title', { required: 'Project title is required' })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Municipality</InputLabel>
              <Select
                label="Municipality"
                defaultValue=""
                {...register('municipality', { required: 'Municipality is required' })}
                error={!!errors.municipality}
              >
                {municipalities.map((m) => (
                  <MenuItem key={m} value={m}>{m}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              {...register('description', { required: 'Description is required' })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Budget (NPR)"
              type="number"
              {...register('budget', { required: 'Budget is required', min: 0 })}
              error={!!errors.budget}
              helperText={errors.budget?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Location"
              {...register('location', { required: 'Location is required' })}
              error={!!errors.location}
              helperText={errors.location?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('startDate', { required: 'Start date is required' })}
              error={!!errors.startDate}
              helperText={errors.startDate?.message}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              {...register('endDate', { required: 'End date is required' })}
              error={!!errors.endDate}
              helperText={errors.endDate?.message}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Assigned Contractor (Optional)</InputLabel>
              <Select
                label="Assigned Contractor"
                defaultValue=""
                {...register('assignedContractor')}
              >
                <MenuItem value="">
                  <em>None (assign later)</em>
                </MenuItem>
                {loadingContractors ? (
                  <MenuItem disabled>Loading contractors...</MenuItem>
                ) : (
                  contractors.map((c) => (
                    <MenuItem key={c._id} value={c._id}>
                      {c.fullName} ({c.contractorDetails?.companyName || 'N/A'})
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tags (comma separated)"
              helperText="e.g., infrastructure, road, water, community"
              {...register('tags')}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Creating Project...' : 'Create Project'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => reset()}
            disabled={isSubmitting}
          >
            Reset Form
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreateProject;
