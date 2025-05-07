import React from 'react';
import { Typography, Box } from '@mui/material';

const PageTitle = ({ title, subtitle }) => {
  return (
    <Box sx={{ mb: 6, textAlign: 'center' }}>
      <Typography 
        variant="h3" 
        sx={{ 
          color: 'primary.main',
          fontWeight: 600,
          mb: subtitle ? 2 : 0
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography 
          variant="h6" 
          color="text.secondary"
          sx={{ maxWidth: '800px', mx: 'auto' }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default PageTitle; 