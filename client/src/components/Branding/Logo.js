import React from 'react';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Logo = ({ variant = 'full', size = 'medium', ...props }) => {
  const theme = useTheme();
  
  const sizes = {
    small: { height: 40, fontSize: '1.4rem' },
    medium: { height: 48, fontSize: '1.6rem' },
    large: { height: 60, fontSize: '2rem' },
    xlarge: { height: 72, fontSize: '2.4rem' },
  };

  const currentSize = sizes[size] || sizes.medium;

  if (variant === 'icon') {
    return (
      <Box
        sx={{
          width: currentSize.height,
          height: currentSize.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...props.sx,
        }}
        {...props}
      >
        <img
          src="/logo.png"
          alt="KaamHeru Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        ...props.sx,
      }}
      {...props}
    >
      <Box
        sx={{
          width: currentSize.height,
          height: currentSize.height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src="/logo.png"
          alt="KaamHeru Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      </Box>
    </Box>
  );
};

export default Logo;
