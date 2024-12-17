import React from 'react';
import { Container, Typography } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ title, children }) => {
  return (
    <>
      <Header />
      <Container
        maxWidth={false}
        component="main"
        sx={{ py: 4, backgroundColor: '#F1F4F7', minHeight: '80vh' }}
      >
        <Typography
          variant="h5"
          component="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            textTransform: 'uppercase',
            letterSpacing: 3,
            marginBottom: 2,
          }}
        >
          {title}
        </Typography>
        {children}
      </Container>
      <Footer />
    </>
  );
};

export default Layout;
