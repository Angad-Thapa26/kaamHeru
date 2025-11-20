import React, { useState, useEffect } from 'react';
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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../../services/api';
import CreateContractor from './CreateContractor';

const ContractorList = () => {
  const [contractors, setContractors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    try {
      const res = await api.get('/users?role=contractor');
      setContractors(res.data.data?.users || []);
    } catch (err) {
      setError('Failed to fetch contractors');
      toast.error('Failed to load contractors');
    } finally {
      setLoading(false);
    }
  };

  const handleContractorCreated = () => {
    setCreateDialogOpen(false);
    fetchContractors();
    toast.success('Contractor created successfully');
  };

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Loading contractors...</Typography>
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
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" gutterBottom>
            Manage Contractors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create and manage contractor accounts for project assignments.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
        >
          Add Contractor
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Contractor ID</TableCell>
              <TableCell>Company</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Projects</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contractors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="text.secondary">
                    No contractors found. Add your first contractor to get started.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              contractors.map((contractor) => (
                <TableRow key={contractor._id}>
                  <TableCell>{contractor.fullName}</TableCell>
                  <TableCell>
                    <Chip
                      label={contractor.contractorDetails?.contractorId || 'N/A'}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{contractor.contractorDetails?.companyName || 'N/A'}</TableCell>
                  <TableCell>
                    {contractor.contractorDetails?.specialization?.join(', ') || 'N/A'}
                  </TableCell>
                  <TableCell>{contractor.contractorDetails?.experience || 0} years</TableCell>
                  <TableCell>{contractor.contractorDetails?.completedProjects || 0}</TableCell>
                  <TableCell>
                    <IconButton size="small" title="View Details">
                      <ViewIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create Contractor Dialog */}
      <Dialog
        open={createDialogOpen}
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Contractor</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <CreateContractor onSuccess={handleContractorCreated} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ContractorList;
