import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/projects')}
        sx={{ mb: 2 }}
      >
        Back to Projects
      </Button>
      
      <Typography variant="h4" gutterBottom>
        Project Details - ID: {id}
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <Typography variant="body1">
          Project detail page will be implemented with comprehensive project information,
          updates, reviews, and progress tracking.
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProjectDetail;
