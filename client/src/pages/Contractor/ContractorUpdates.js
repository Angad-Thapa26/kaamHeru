import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { projectsAPI, updatesAPI } from '../../services/api';
import { formatDistanceToNow } from 'date-fns';

const UpdateCard = ({ update, projectsById }) => {
  const theme = useTheme();
  const typeColor = theme.palette.text.secondary;
  return (
    <Card
      sx={{
        mb: 2,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: 'box-shadow 0.2s ease',
        '&:hover': { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{update.title}</Typography>
          <Chip 
            label={update.updateType} 
            size="small"
            sx={{ backgroundColor: theme.palette.action.hover, color: theme.palette.text.secondary, fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {update.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
          {update.images?.map((img, idx) => (
            <Box key={idx} component="img" src={img} alt={`Update ${idx}`} sx={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 1, border: `1px solid ${theme.palette.divider}` }} />
          ))}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Chip label={projectsById[update.project]?.title || 'Project'} size="small" variant="outlined" />
          <Typography variant="caption" color="text.secondary">
            {update.createdAt && formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const ContractorUpdates = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    project: '',
    updateType: 'Progress Update',
    title: '',
    description: '',
    images: ['/placeholder.png'],
  });

  const projectsById = useMemo(() => Object.fromEntries(projects.map(p => [p._id, p])), [projects]);

  const loadData = async () => {
    try {
      if (!user?._id) return;
      const [projectsRes, updatesRes] = await Promise.all([
        projectsAPI.getContractorProjects(user._id),
        updatesAPI.getUserUpdates(user._id),
      ]);
      setProjects(projectsRes.data?.data?.projects || []);
      setUpdates(updatesRes.data?.data?.updates || []);
    } catch (e) {
      console.error(e);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      if (!form.project) {
        setError('Please select a project');
        setSaving(false);
        return;
      }
      const payload = {
        project: form.project,
        updateType: form.updateType,
        title: form.title,
        description: form.description,
        images: form.images, // uses placeholder for now
      };
      const res = await updatesAPI.createUpdate(payload);
      const created = res.data?.data?.update;
      if (created) {
        setUpdates(prev => [created, ...prev]);
        setSuccess('Update posted successfully');
        setForm({ project: '', updateType: 'Progress Update', title: '', description: '', images: ['/placeholder.png'] });
      }
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || 'Failed to create update');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Loading updates...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          Project Updates
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Share progress with the municipality and public
        </Typography>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

      {/* Create Update Form */}
      <Paper 
        sx={{ 
          p: 3, mb: 4,
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 3
        }} 
        component="form" 
        onSubmit={handleSubmit}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Add Update</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Project"
              name="project"
              value={form.project}
              onChange={handleChange}
              required
            >
              {projects.map(p => (
                <MenuItem key={p._id} value={p._id}>{p.title}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              select
              fullWidth
              label="Update Type"
              name="updateType"
              value={form.updateType}
              onChange={handleChange}
            >
              {['Status Change', 'Progress Update', 'Photo Update', 'Budget Update', 'Timeline Change', 'Issue Report'].map(t => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Images (placeholder used for now)
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {form.images.map((img, idx) => (
                <Box key={idx} component="img" src={img} alt="preview" sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1, border: '1px solid rgba(0,0,0,0.1)' }} />)
              )}
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={saving}
              sx={{ textTransform: 'none', fontWeight: 600 }}
            >
              {saving ? 'Posting...' : 'Post Update'}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Updates List */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>My Recent Updates</Typography>
      {updates.length === 0 ? (
        <Paper 
          sx={{ 
            p: 6, textAlign: 'center',
            background: theme.palette.background.paper,
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 3
          }}
        >
          <Typography variant="body2" color="text.secondary">No updates yet. Post your first update above.</Typography>
        </Paper>
      ) : (
        updates.map(u => (
          <UpdateCard key={u._id} update={u} projectsById={projectsById} />
        ))
      )}
    </Box>
  );
};

export default ContractorUpdates;
