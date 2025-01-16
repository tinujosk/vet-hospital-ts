import React from 'react';
import { Box, Grid, Typography, Container, IconButton } from '@mui/material';
import { Facebook, Instagram, Twitter, LinkedIn } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 4,
        mt: 4,
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant='h6' gutterBottom>
              {t('aboutVetClinicPro')}
            </Typography>
            <Typography variant='body2' color='inherit'>
              {t('vetClinicProDescription')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant='h6' gutterBottom>
              {t('services')}
            </Typography>
            <Typography variant='body2' color='inherit'>
              {t('petHealthCheckups')}
            </Typography>
            <Typography variant='body2' color='inherit'>
              {t('vaccinations')}
            </Typography>
            <Typography variant='body2' color='inherit'>
              {t('dentalCare')}
            </Typography>
            <Typography variant='body2' color='inherit'>
              {t('emergencyServices')}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant='h6' gutterBottom>
              {t('contactUs')}
            </Typography>
            <Typography variant='body2' color='inherit'>
              {t('phone')}: +1-800-VET-PRO
            </Typography>
            <Typography variant='body2' color='inherit'>
              {t('email')}: support@vetclinicpro.com
            </Typography>
            <Typography variant='body2' color='inherit'>
              {t('address')}: Conestoga Doon, Ontario, Canada.
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant='h6' gutterBottom>
              {t('followUs')}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <IconButton
                href='https://facebook.com'
                target='_blank'
                aria-label='Facebook'
                sx={{ color: 'white' }}
              >
                <Facebook />
              </IconButton>
              <IconButton
                href='https://instagram.com'
                target='_blank'
                aria-label='Instagram'
                sx={{ color: 'white' }}
              >
                <Instagram />
              </IconButton>
              <IconButton
                href='https://twitter.com'
                target='_blank'
                aria-label='Twitter'
                sx={{ color: 'white' }}
              >
                <Twitter />
              </IconButton>
              <IconButton
                href='https://linkedin.com'
                target='_blank'
                aria-label='LinkedIn'
                sx={{ color: 'white' }}
              >
                <LinkedIn />
              </IconButton>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            textAlign: 'center',
            mt: 4,
            pt: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          }}
        >
          <Typography variant='body2' color='inherit'>
            &copy; {new Date().getFullYear()} {t('allRightsReserved')}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
