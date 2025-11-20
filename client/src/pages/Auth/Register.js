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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { useAuth } from '../../contexts/AuthContext';
import GoogleLoginButton from '../../components/UI/GoogleLoginButton';
import api from '../../services/api';

const municipalities = [
  'Bharatpur',
  'Ratnanagar',
  'Kawasoti',
  'Gaindakot',
  'Madhyabindu',
  'Bharatpur Metropolitain',
  'Ratnanagar Municipality',
  'Kawasoti Municipality',
  'Gaindakot Municipality',
  'Madhyabindu Municipality',
];

const Register = () => {
  const { register: registerUser, loginWithGoogle, handleGoogleCallback, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [adminExists, setAdminExists] = useState(false);

  // Handle Google OAuth callback
  useEffect(() => {
    const token = searchParams.get('token');
    const user = searchParams.get('user');
    const authError = searchParams.get('error');

    if (authError) {
      toast.error('Google authentication failed');
      navigate('/register', { replace: true });
      return;
    }

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        handleGoogleCallback(token, userData)
          .then(() => {
            toast.success('Google registration successful!');
            navigate('/dashboard', { replace: true });
          })
          .catch(() => {
            toast.error('Google registration failed');
            navigate('/register', { replace: true });
          });
      } catch (error) {
        console.error('Error parsing user data:', error);
        toast.error('Authentication failed');
        navigate('/register', { replace: true });
      }
    }
  }, [searchParams, navigate, handleGoogleCallback]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm();

  const password = watch('password');

  // Check if an admin already exists to hide/disable Admin role selection
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await api.get('/auth/admin-exists');
        if (isMounted) {
          const exists = !!res?.data?.data?.exists;
          setAdminExists(exists);
          if (exists) {
            setValue('role', 'public');
          }
        }
      } catch (e) {
        // If this fails, default behavior still safe due to backend guard
      }
    })();
    return () => { isMounted = false; };
  }, [setValue]);

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true);
      clearError();
      await registerUser(data);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister = () => {
    try {
      loginWithGoogle();
    } catch (err) {
      toast.error('Google registration failed');
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
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
            Sign Up
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
              id="username"
              label="Username"
              autoComplete="username"
              autoFocus
              {...register('username', {
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters',
                },
              })}
              error={!!errors.username}
              helperText={errors.username?.message}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="fullName"
              label="Full Name"
              autoComplete="name"
              {...register('fullName', {
                required: 'Full name is required',
              })}
              error={!!errors.fullName}
              helperText={errors.fullName?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
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
              label="Phone Number"
              type="tel"
              id="phoneNumber"
              {...register('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9\s\-\(\)]+$/,
                  message: 'Phone number must contain only digits, spaces, dashes, or parentheses',
                },
                validate: {
                  minLength: (value) => {
                    const digitsOnly = value.replace(/\D/g, '');
                    return digitsOnly.length >= 10 || 'Phone number must have at least 10 digits';
                  }
                }
              })}
              error={!!errors.phoneNumber}
              helperText={errors.phoneNumber?.message}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="municipality-label">Municipality</InputLabel>
              <Select
                labelId="municipality-label"
                id="municipality"
                label="Municipality"
                defaultValue=""
                {...register('municipality', {
                  required: 'Municipality is required',
                })}
                error={!!errors.municipality}
              >
                {municipalities.map((municipality) => (
                  <MenuItem key={municipality} value={municipality}>
                    {municipality}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              label="Address"
              id="address"
              multiline
              rows={2}
              {...register('address')}
            />

            <FormControl fullWidth margin="normal" disabled={adminExists}>
              <InputLabel id="role-label">Account Type</InputLabel>
              <Select
                labelId="role-label"
                id="role"
                label="Account Type"
                defaultValue="public"
                {...register('role')}
                disabled={adminExists}
              >
                <MenuItem value="public">Public User</MenuItem>
                {!adminExists && <MenuItem value="admin">Administrator</MenuItem>}
              </Select>
              {adminExists ? (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, ml: 2 }}>
                  An administrator already exists. Creating additional admins is disabled.
                </Typography>
              ) : (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, ml: 2 }}>
                  Public users can view projects and submit reviews. Admin accounts have full system access.
                </Typography>
              )}
            </FormControl>

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
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

            <TextField
              margin="normal"
              required
              fullWidth
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting || loading}
              startIcon={isSubmitting || loading ? <CircularProgress size={20} /> : null}
            >
              {isSubmitting || loading ? 'Creating Account...' : 'Sign Up'}
            </Button>

            <Divider sx={{ my: 2 }}>
              <Typography variant="body2" color="text.secondary">
                OR
              </Typography>
            </Divider>

            <GoogleLoginButton
              fullWidth
              onClick={handleGoogleRegister}
              disabled={loading}
            />
            
            <Box textAlign="center" sx={{ mt: 2 }}>
              <Link to="/login" style={{ textDecoration: 'none' }}>
                <Typography variant="body2" color="primary">
                  Already have an account? Sign In
                </Typography>
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
