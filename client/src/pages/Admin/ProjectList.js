import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';

const statusColors = {
  planning: 'warning',
  in_progress: 'info',
  completed: 'success',
  delayed: 'error',
  cancelled: 'default',
};

const ProjectList = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [contractors, setContractors] = useState([]);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    fetchContractors();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data.data?.projects || []);
    } catch (err) {
      setError('Failed to fetch projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const fetchContractors = async () => {
    try {
      const res = await api.get('/users?role=contractor');
      setContractors(res.data.data?.users || []);
    } catch (err) {
      console.error('Failed to fetch contractors:', err);
    }
  };

  const handleAssignContractor = async () => {
    if (!selectedProject || !selectedProject.assignedContractor) {
      toast.error('Please select a contractor');
      return;
    }

    try {
      await api.put(`/projects/${selectedProject._id}`, {
        assignedContractor: selectedProject.assignedContractor,
      });
      toast.success('Contractor assigned successfully');
      setAssignDialogOpen(false);
      fetchProjects();
    } catch (err) {
      toast.error('Failed to assign contractor');
    }
  };

  const openAssignDialog = (project) => {
    setSelectedProject({
      ...project,
      assignedContractor: project.assignedContractor?._id || '',
    });
    setAssignDialogOpen(true);
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Loading projects...</Typography>
      </Paper>
    );
  }

  if (error) {
    return (
      <Paper sx={{ p: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Manage Projects
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        View, edit, and assign contractors to local government projects.
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Municipality</TableCell>
              <TableCell>Budget</TableCell>
              <TableCell>Spent</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Contractor</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No projects found. Create your first project to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              projects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell>{project.title}</TableCell>
                  <TableCell>{project.municipality}</TableCell>
                  <TableCell>NPR {project.budget.allocated?.toLocaleString()}</TableCell>
                  <TableCell>NPR {project.budget.spent?.toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={project.status?.replace('_', ' ')}
                      color={statusColors[project.status] || 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {project.assignedContractor
                      ? project.assignedContractor.fullName
                      : 'Not assigned'}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      onClick={() => openAssignDialog(project)}
                      title="Assign Contractor"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/projects/${project._id}`)}
                      title="View Details"
                    >
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assign Contractor Dialog */}
      <Dialog
        open={assignDialogOpen}
        onClose={() => setAssignDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Assign Contractor to Project</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Project: {selectedProject?.title}
          </Typography>
          <FormControl fullWidth>
            <InputLabel>Select Contractor</InputLabel>
            <Select
              value={selectedProject?.assignedContractor || ''}
              onChange={(e) =>
                setSelectedProject({
                  ...selectedProject,
                  assignedContractor: e.target.value,
                })
              }
            >
              <MenuItem value="">
                <em>None (unassign)</em>
              </MenuItem>
              {contractors.map((contractor) => (
                <MenuItem key={contractor._id} value={contractor._id}>
                  {contractor.fullName} ({contractor.contractorDetails?.companyName || 'N/A'})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAssignContractor} variant="contained">
            Assign Contractor
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ProjectList;
