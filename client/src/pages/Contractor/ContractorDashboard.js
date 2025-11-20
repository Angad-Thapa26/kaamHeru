import React from 'react';
import { Routes, Route } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
} from '@mui/material';
import ContractorReviews from '../Reviews/ContractorReviews';
import ContractorProjects from './ContractorProjects';
import ContractorUpdates from './ContractorUpdates';

const ContractorDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contractor Dashboard
      </Typography>
      
      <Routes>
        <Route index element={
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Welcome to Contractor Dashboard
            </Typography>
            <Typography variant="body2">
              Manage your assigned projects and updates here.
            </Typography>
          </Paper>
        } />
        <Route path="dashboard" element={
          <Paper sx={{ p: 3 }}>
            <Typography>Contractor Dashboard Overview</Typography>
          </Paper>
        } />
        <Route path="projects" element={
          <ContractorProjects />
        } />
        <Route path="updates" element={
          <ContractorUpdates />
        } />
        <Route path="reviews" element={<ContractorReviews />} />
      </Routes>
    </Box>
  );
};

export default ContractorDashboard;
