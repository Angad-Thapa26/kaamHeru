import React from 'react';
import {
  Box,
  Typography,
} from '@mui/material';
import ContractorList from './ContractorList';

const ContractorsTab = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Contractors Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create and manage contractor accounts for project assignments.
      </Typography>

      <ContractorList />
    </Box>
  );
};

export default ContractorsTab;
