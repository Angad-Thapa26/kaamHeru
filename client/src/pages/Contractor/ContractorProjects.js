import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Grid, Chip, CircularProgress, Alert, Card, CardContent, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { projectsAPI } from '../../services/api';
import { format, differenceInCalendarDays, startOfDay, isValid } from 'date-fns';

const ProjectCard = ({ project }) => {
  const theme = useTheme();
  const statusColor =
    project.status === 'Completed' ? theme.palette.success.main :
    project.status === 'Delayed' ? theme.palette.warning.main :
    project.status === 'In Progress' ? theme.palette.info.main : theme.palette.text.secondary;

  // Dates
  const rawStart = project.timeline?.startDate ? new Date(project.timeline.startDate) : null;
  const rawEnd = project.timeline?.endDate ? new Date(project.timeline.endDate) : null;
  const start = rawStart && isValid(rawStart) ? startOfDay(rawStart) : null;
  const end = rawEnd && isValid(rawEnd) ? startOfDay(rawEnd) : null;
  const todayDay = startOfDay(new Date());
  const remainingDays = end ? Math.max(differenceInCalendarDays(end, todayDay) + 1, 0) : null;

  return (
    <Card
      sx={{
        mb: 2,
        background: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 3,
        },
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {project.title}
          </Typography>
          <Chip 
            label={project.status} 
            size="small"
            sx={{ backgroundColor: statusColor + '20', color: statusColor, fontWeight: 600 }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {project.description?.substring(0, 160)}{project.description?.length > 160 ? '...' : ''}
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
          <Chip label={project.category} size="small" variant="outlined" />
          <Chip label={project.municipality} size="small" variant="outlined" />
        </Box>
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip 
            label={`Start: ${start ? format(start, 'PP') : 'N/A'}`} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label={`End: ${end ? format(end, 'PP') : 'N/A'}`} 
            size="small" 
            variant="outlined" 
          />
          <Chip 
            label={`Remaining: ${remainingDays !== null ? `${remainingDays} days` : 'N/A'}`} 
            size="small" 
          />
        </Box>
      </CardContent>
    </Card>
  );
};

const ContractorProjects = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        if (!user?._id) return;
        const res = await projectsAPI.getContractorProjects(user._id);
        const data = res.data?.data?.projects || res.data?.projects || [];
        setProjects(data);
      } catch (e) {
        setError('Failed to load your projects');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [user?._id]);

  if (loading) {
    return (
      <Paper sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>Loading your projects...</Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3, border: theme => `1px solid ${theme.palette.divider}`, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          My Projects
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Total Projects: {projects.length}
        </Typography>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Grid container spacing={3} alignItems="stretch">
        {projects.length === 0 ? (
          <Grid item xs={12}>
            <Paper 
              sx={{ 
                p: 6, textAlign: 'center', 
                background: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3
              }}
            >
              <Typography variant="h6" color="text.secondary">No projects assigned yet</Typography>
              <Typography variant="body2" color="text.secondary">You will see projects here when an admin assigns them to you.</Typography>
            </Paper>
          </Grid>
        ) : (
          projects.map((p) => (
            <Grid key={p._id} item xs={12} sm={6} md={4}>
              <ProjectCard project={p} />
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
}

export default ContractorProjects;
