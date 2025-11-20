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
  CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../../services/api';

const municipalities = [
  'Bharatpur', 'Ratnanagar', 'Kawasoti', 'Gaindakot', 'Madhyabindu',
  'Bharatpur Metropolitain', 'Ratnanagar Municipality', 'Kawasoti Municipality',
  'Gaindakot Municipality', 'Madhyabindu Municipality',
];

const categories = [
  'Road Construction', 'Building Construction', 'Water Supply', 'Sanitation',
  'Electricity', 'Education', 'Health', 'Agriculture', 'Tourism', 'Other'
];

const CreateProject = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contractors, setContractors] = useState([]);
  const [loadingContractors, setLoadingContractors] = useState(true);

  const {
    control,
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
        projectId: `PRJ-${Date.now()}`, // Generate unique project ID
        ...data,
        budget: {
          allocated: parseFloat(data.budget)
        },
        timeline: {
          startDate: new Date(data.startDate).toISOString(),
          endDate: new Date(data.endDate).toISOString(),
        },
        status: 'Planned', // Match backend enum
        assignedContractor: data.assignedContractor || null,
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
            <Controller
              name="title"
              control={control}
              rules={{ required: 'Project title is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Project Title"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth required error={!!fieldState.error}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    {...field}
                    label="Category"
                    value={field.value || ''}
                  >
                    <MenuItem value="">
                      <em>Select a category</em>
                    </MenuItem>
                    {categories.map((c) => (
                      <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant="caption" color="error">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="municipality"
              control={control}
              rules={{ required: 'Municipality is required' }}
              render={({ field, fieldState }) => (
                <FormControl fullWidth required error={!!fieldState.error}>
                  <InputLabel>Municipality</InputLabel>
                  <Select
                    {...field}
                    label="Municipality"
                    value={field.value || ''}
                  >
                    <MenuItem value="">
                      <em>Select a municipality</em>
                    </MenuItem>
                    {municipalities.map((m) => (
                      <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                  </Select>
                  {fieldState.error && (
                    <Typography variant="caption" color="error">
                      {fieldState.error.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="description"
              control={control}
              rules={{ required: 'Description is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  rows={4}
                  label="Description"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="budget"
              control={control}
              rules={{ required: 'Budget is required', min: 0 }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Budget (NPR)"
                  type="number"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="location"
              control={control}
              rules={{ required: 'Location is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Location"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="startDate"
              control={control}
              rules={{ required: 'Start date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Start Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Controller
              name="endDate"
              control={control}
              rules={{ required: 'End date is required' }}
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="assignedContractor"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel>Assigned Contractor (Optional)</InputLabel>
                  <Select
                    {...field}
                    label="Assigned Contractor"
                    value={field.value || ''}
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
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Tags (comma separated)"
                  helperText="e.g., infrastructure, road, water, community"
                />
              )}
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
