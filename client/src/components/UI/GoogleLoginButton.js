import React from 'react';
import { Button } from '@mui/material';
import { Google as GoogleIcon } from '@mui/icons-material';

const GoogleLoginButton = ({ onClick, fullWidth = false, variant = 'outlined', ...props }) => {
  return (
    <Button
      fullWidth={fullWidth}
      variant={variant}
      startIcon={<GoogleIcon />}
      onClick={onClick}
      sx={{
        textTransform: 'none',
        borderColor: '#dadce0',
        color: '#3c4043',
        backgroundColor: variant === 'contained' ? '#f8f9fa' : 'transparent',
        '&:hover': {
          backgroundColor: variant === 'contained' ? '#f1f3f4' : '#f8f9fa',
          borderColor: '#c0c4c7',
        },
        py: 1.5,
      }}
      {...props}
    >
      Continue with Google
    </Button>
  );
};

export default GoogleLoginButton;
