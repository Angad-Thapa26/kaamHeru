import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import api from '../../services/api';

const DebugPanel = () => {
  const [serverStatus, setServerStatus] = useState(null);
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const response = await api.get('/health');
      setServerStatus({
        success: true,
        data: response.data,
      });
    } catch (error) {
      setServerStatus({
        success: false,
        error: error.message,
      });
    }
  };

  const testRegistration = async () => {
    setLoading(true);
    try {
      const testData = {
        username: 'testuser_' + Date.now(),
        email: `test_${Date.now()}@example.com`,
        password: 'password123',
        fullName: 'Test User',
        municipality: 'Bharatpur',
        role: 'public',
        phoneNumber: '1234567890',
        address: 'Test Address'
      };

      const response = await api.post('/auth/register', testData);
      setTestResult({
        success: true,
        data: response.data,
      });
    } catch (error) {
      setTestResult({
        success: false,
        error: error.response?.data || error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        KaamHeru Debug Panel
      </Typography>

      {/* Server Status */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Server Health Check
          </Typography>
          {serverStatus ? (
            <Box>
              <Chip
                label={serverStatus.success ? 'Connected' : 'Disconnected'}
                color={serverStatus.success ? 'success' : 'error'}
                sx={{ mb: 2 }}
              />
              {serverStatus.success ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Status: {serverStatus.data.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Database: {serverStatus.data.database?.status}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Environment: {serverStatus.data.environment}
                  </Typography>
                </Box>
              ) : (
                <Alert severity="error">
                  Server Error: {serverStatus.error}
                </Alert>
              )}
            </Box>
          ) : (
            <Typography variant="body2">Checking server status...</Typography>
          )}
          <Button onClick={checkServerHealth} sx={{ mt: 2 }}>
            Refresh Status
          </Button>
        </CardContent>
      </Card>

      {/* Registration Test */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Registration Test
          </Typography>
          <Button
            variant="contained"
            onClick={testRegistration}
            disabled={loading || !serverStatus?.success}
            sx={{ mb: 2 }}
          >
            {loading ? 'Testing...' : 'Test Registration'}
          </Button>
          
          {testResult && (
            <Box>
              <Divider sx={{ my: 2 }} />
              <Chip
                label={testResult.success ? 'Success' : 'Failed'}
                color={testResult.success ? 'success' : 'error'}
                sx={{ mb: 2 }}
              />
              {testResult.success ? (
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Message: {testResult.data.message}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    User ID: {testResult.data.data?.user?._id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Email: {testResult.data.data?.user?.email}
                  </Typography>
                </Box>
              ) : (
                <Alert severity="error">
                  Registration Error: {JSON.stringify(testResult.error, null, 2)}
                </Alert>
              )}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            API Configuration
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Base URL: {process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Environment: {process.env.NODE_ENV || 'development'}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DebugPanel;
