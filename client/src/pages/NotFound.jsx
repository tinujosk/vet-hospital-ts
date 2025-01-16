import React from 'react';
import { Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFoundPage({ reason }) {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(-1);
  };

  return (
    <Box
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      minHeight='100vh'
      textAlign='center'
    >
      <Typography variant='h1' color='error'>
        {reason.reasonCode}
      </Typography>
      <Typography variant='h5' gutterBottom>
        {reason.reasonTitle}
      </Typography>
      <Typography variant='body1' gutterBottom>
        {reason.reasonDescription}
      </Typography>
      <Button variant='contained' color='primary' onClick={handleGoHome}>
        Go Back
      </Button>
    </Box>
  );
}

export default NotFoundPage;
