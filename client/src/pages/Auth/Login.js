import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../../components/UI/GoogleLoginButton';

const Login = () => {
  const { login, loginWithGoogle, handleGoogleCallback, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const authError = searchParams.get('error');

    if (authError) {
      toast.error('Google authentication failed');
      navigate('/login', { replace: true });
      return;
    }

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        handleGoogleCallback(token, userData)
          .then(() => {
            toast.success('Google login successful!');
            navigate('/dashboard', { replace: true });
          })
          .catch(() => {
            toast.error('Google login failed');
            navigate('/login', { replace: true });
          });
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Authentication failed');
        navigate('/login', { replace: true });
      }
    }
  }, [searchParams, navigate, handleGoogleCallback]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearError();
      await login(data.email, data.password);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    try {
      loginWithGoogle();
    } catch (err) {
      toast.error('Google login failed');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            कामहेरू (KaamHeru)
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Transparency in Nepalese Municipal Development
          </Typography>
          
          <Typography component="h2" variant="h5" align="center" gutterBottom>
            Sign In
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || loading}
              startIcon={isSubmitting || loading ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting || loading ? 'Signing In...' : 'Sign In'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <GoogleLoginButton
              fullWidth
              onClick={handleGoogleLogin}
              disabled={loading}
            />
            
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link to="/register" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Don't have an account? Sign Up
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
