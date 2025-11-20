import React, { useState } from 'react';
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';
import CreateProject from './CreateProject';
import ProjectList from './ProjectList';

const ProjectsTab = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects Management
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Create and manage local government projects. Projects will be visible to the public once created.
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Create Project" />
          <Tab label="All Projects" />
        </Tabs>
      </Box>

      {tabValue === 0 && <CreateProject />}
      {tabValue === 1 && <ProjectList />}
    </Box>
  );
};

export default ProjectsTab;
