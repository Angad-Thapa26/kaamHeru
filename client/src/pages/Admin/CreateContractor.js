import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Grid,
  Card,
  CardContent,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowBack, Add, Business } from '@mui/icons-material';

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

const steps = ['Basic Information', 'Professional Details', 'Account Setup'];

const CreateContractor = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [contractorData, setContractorData] = useState({
    basic: {},
    professional: {},
    account: {}
  });

  const { register: registerBasic, handleSubmit: handleBasicSubmit, formState: { errors: basicErrors } } = useForm();
  const { register: registerProfessional, handleSubmit: handleProfessionalSubmit, formState: { errors: professionalErrors }, control: professionalControl, reset: resetProfessional } = useForm({
    defaultValues: contractorData.professional || {},
  });

  // when user navigates back to professional step, populate the form with saved data
  useEffect(() => {
    if (activeStep === 1) {
      try {
        resetProfessional(contractorData.professional || {});
      } catch (e) {
        // ignore
      }
    }
  }, [activeStep, contractorData.professional, resetProfessional]);
  const { register: registerAccount, handleSubmit: handleAccountSubmit, formState: { errors: accountErrors }, watch } = useForm();

  const generateContractorId = () => {
    const prefix = 'CTR';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  };

  const onBasicSubmit = (data) => {
    setContractorData(prev => ({ ...prev, basic: data }));
    setActiveStep(1);
  };

  const onProfessionalSubmit = (data) => {
    setContractorData(prev => ({ ...prev, professional: data }));
    setActiveStep(2);
  };

  const onAccountSubmit = async (data) => {
    setIsSubmitting(true);
    setError('');

    try {
      const contractorId = generateContractorId();
      
      const contractorPayload = {
        ...contractorData.basic,
        ...contractorData.professional,
        ...data,
        role: 'contractor',
        contractorId: contractorId,
        isVerified: true,
        verifiedBy: 'admin', // This would come from current admin user
        verifiedAt: new Date().toISOString(),
      };

      // Combine firstName and lastName into fullName for backend
      if (contractorPayload.firstName && contractorPayload.lastName) {
        contractorPayload.fullName = `${contractorPayload.firstName} ${contractorPayload.lastName}`;
      }

      // Remove confirmPassword from payload as it's not needed by backend
      delete contractorPayload.confirmPassword;

      // Validate required fields before sending
      const requiredFields = ['firstName', 'lastName', 'email', 'password', 'phoneNumber'];
      const missingFields = requiredFields.filter(field => !contractorPayload[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Ensure fullName is present after combining
      if (!contractorPayload.fullName) {
        throw new Error('Full name is required (firstName and lastName must be provided)');
      }

      // Debug logging
      console.log('Contractor payload being sent:', contractorPayload);
      console.log('Basic data:', contractorData.basic);
      console.log('Professional data:', contractorData.professional);
      console.log('Account data:', data);
      
      const response = await api.post('/auth/register', contractorPayload);
      
      toast.success(`Contractor created successfully! ID: ${contractorId}`);
      navigate('/admin/contractors');
    } catch (err) {
      console.error('Contractor creation error:', err);
      console.error('Error response:', err.response?.data);
      
      // Log detailed validation errors
      if (err.response?.data?.errors) {
        console.error('Validation errors details:', err.response.data.errors);
        err.response.data.errors.forEach((error, index) => {
          console.error(`Validation error ${index + 1}:`, error);
        });
        
        // Show specific validation errors to user
        const validationErrors = err.response.data.errors.map(error => 
          typeof error === 'string' ? error : error.msg || error.message || 'Invalid field'
        ).join(', ');
        
        const errorMessage = `${err.response.data.message}: ${validationErrors}`;
        setError(errorMessage);
        toast.error(errorMessage);
      } else {
        const errorMessage = err.response?.data?.message || err.message || 'Failed to create contractor';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box key="basic-form" component="form" onSubmit={handleBasicSubmit(onBasicSubmit)}>
            <Typography variant="h6" gutterBottom>
              Contractor Head Basic Information
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="basic-first-name"
                  label="First Name"
                  {...registerBasic('firstName', { required: 'First name is required' })}
                  error={!!basicErrors.firstName}
                  helperText={basicErrors.firstName?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="basic-last-name"
                  label="Last Name"
                  {...registerBasic('lastName', { required: 'Last name is required' })}
                  error={!!basicErrors.lastName}
                  helperText={basicErrors.lastName?.message}
                />
              </Grid>
            </Grid>

            <TextField
              margin="normal"
              required
              fullWidth
              id="basic-username"
              label="Username"
              {...registerBasic('username', {
                required: 'Username is required',
                minLength: { value: 3, message: 'Username must be at least 3 characters' }
              })}
              error={!!basicErrors.username}
              helperText={basicErrors.username?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="basic-email"
              label="Email Address"
              type="email"
              {...registerBasic('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={!!basicErrors.email}
              helperText={basicErrors.email?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="basic-phone"
              label="Phone Number"
              {...registerBasic('phoneNumber', {
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number',
                },
              })}
              error={!!basicErrors.phoneNumber}
              helperText={basicErrors.phoneNumber?.message}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
              <Button type="submit" variant="contained" endIcon={<Add />}>
                Next Step
              </Button>
            </Box>
          </Box>
        );

      case 1:
        return (
          <Box key="professional-form" component="form" onSubmit={handleProfessionalSubmit(onProfessionalSubmit)}>
            <Typography variant="h6" gutterBottom>
              Professional Details
            </Typography>

            <TextField
              margin="normal"
              required
              fullWidth
              id="professional-company-name"
              label="Company Name"
              {...registerProfessional('companyName', { required: 'Company name is required' })}
              error={!!professionalErrors.companyName}
              helperText={professionalErrors.companyName?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="professional-specialization"
              label="Specialization"
              placeholder="e.g., Road Construction, Building, Water Supply"
              {...registerProfessional('specialization', { required: 'Specialization is required' })}
              error={!!professionalErrors.specialization}
              helperText={professionalErrors.specialization?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="professional-license-number"
              label="License Number"
              {...registerProfessional('licenseNumber', { required: 'License number is required' })}
              error={!!professionalErrors.licenseNumber}
              helperText={professionalErrors.licenseNumber?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="professional-experience"
              label="Years of Experience"
              type="number"
              inputProps={{ min: 0, max: 50 }}
              {...registerProfessional('experience', {
                required: 'Experience is required',
                min: { value: 0, message: 'Experience must be at least 0' }
              })}
              error={!!professionalErrors.experience}
              helperText={professionalErrors.experience?.message}
            />

            <FormControl fullWidth margin="normal" required>
              <InputLabel id="professional-municipality-label">Primary Municipality</InputLabel>
              <Controller
                name="municipality"
                control={professionalControl}
                rules={{ required: 'Municipality is required' }}
                render={({ field }) => (
                  <Select
                    labelId="professional-municipality-label"
                    id="professional-municipality"
                    {...field}
                    value={field.value || ''}
                    label="Primary Municipality"
                    error={!!professionalErrors.municipality}
                  >
                    {municipalities.map((municipality) => (
                      <MenuItem key={municipality} value={municipality}>
                        {municipality}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              id="professional-address"
              label="Office Address"
              multiline
              rows={3}
              {...registerProfessional('address')}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" variant="contained" endIcon={<Add />}>
                Next Step
              </Button>
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box key="account-form" component="form" onSubmit={handleAccountSubmit(onAccountSubmit)}>
            <Typography variant="h6" gutterBottom>
              Account Setup
            </Typography>

            <Alert severity="info" sx={{ mb: 3 }}>
              A unique contractor ID will be generated automatically upon account creation.
            </Alert>

            <TextField
              margin="normal"
              required
              fullWidth
              id="account-password"
              label="Password"
              type="password"
              {...registerAccount('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={!!accountErrors.password}
              helperText={accountErrors.password?.message}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="account-confirm-password"
              label="Confirm Password"
              type="password"
              {...registerAccount('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === watch('password') || 'Passwords do not match',
              })}
              error={!!accountErrors.confirmPassword}
              helperText={accountErrors.confirmPassword?.message}
            />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button onClick={handleBack} startIcon={<ArrowBack />}>
                Back
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} /> : <Business />}
              >
                {isSubmitting ? 'Creating Contractor...' : 'Create Contractor Account'}
              </Button>
            </Box>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/admin')}
          sx={{ mb: 2 }}
        >
          Back to Admin Dashboard
        </Button>

        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom>
            Create Contractor Account
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Register a new contractor with a unique contractor ID
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {renderStepContent(activeStep)}
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateContractor;
