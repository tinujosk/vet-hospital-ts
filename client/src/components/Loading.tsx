import React from 'react';
import { CircularProgress, Container } from '@mui/material';

const Loading = () => (
  <Container
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '80%',
    }}
  >
    <CircularProgress />
  </Container>
);

export default Loading;
