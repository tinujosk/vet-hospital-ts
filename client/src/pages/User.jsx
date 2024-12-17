import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Typography,
  Button,
  Container,
  Avatar,
  Box,
  Divider,
} from '@mui/material';
import {Modal, TextField} from '@mui/material'
import { useTranslation } from 'react-i18next';
import { getUserDetailsFromToken } from '../util';
import { fetchUserDetails } from '../slices/userSlice';
import { resetPassword } from '../services/userService';

const User = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { staffDetails, loading, error } = useSelector(state => state.user);

  useEffect(() => {
    if (Object.keys(staffDetails?.length === 0)) {
      const { userId } = getUserDetailsFromToken() || {};
      if (userId) {
        dispatch(fetchUserDetails(userId));
      }
    }
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const handlePasswordChange = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setNewPassword('');
    setConfirmPassword('');
    setPasswordError('');
    setSuccessMessage('');
  };

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      setPasswordError('Both fields are required');
      return;
    }
  
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }
  
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      return;
    }
  
    try {
      const { userId } = getUserDetailsFromToken();
      console.log('User ID for password reset:', userId); // Log userId
      const response = await resetPassword(userId, newPassword);
      console.log('Password reset response:', response); // Log server response
      setSuccessMessage('Password updated successfully');
      setTimeout(() => handleModalClose(), 2000); 
    } catch (error) {
      console.error('Password reset failed:', error);
      setPasswordError('Failed to reset password');
    }
  };
  

  return (
    <Container maxWidth='lg' sx={{ mt: 4 }}>
      <Divider sx={{ mb: 3 }} />
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'center', md: 'flex-start' },
          justifyContent: 'space-between',
          gap: 4,
        }}
      >
        {/* Avatar Section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Avatar
            sx={{
              width: 150,
              height: 150,
              fontSize: 48,
              bgcolor: 'primary.main',
            }}
          >
            {staffDetails?.firstName?.charAt(0).toUpperCase() || 'U'}
          </Avatar>
        </Box>

        {/* User Details Section */}
        <Box
          sx={{
            flex: 1,
          }}
        >
          <Typography variant='h6' sx={{ mb: 2 }}>
            <strong>{t('name')}:</strong>{' '}
            {`${staffDetails?.firstName} ${staffDetails?.lastName}` || 'N/A'}
          </Typography>
          <Typography variant='h6' sx={{ mb: 2 }}>
            <strong>{t('role')}:</strong> {staffDetails?.user?.role || 'N/A'}
          </Typography>
          {staffDetails?.specialization && (
            <Typography variant='h6' sx={{ mb: 2 }}>
              <strong>{t('specialization')}:</strong>{' '}
              {staffDetails?.specialization || 'N/A'}
            </Typography>
          )}
          <Typography variant='h6' sx={{ mb: 2 }}>
            <strong>{t('email')}:</strong> {staffDetails?.user?.email || 'N/A'}
          </Typography>
          <Typography variant='h6' sx={{ mb: 2 }}>
            <strong>{t('secondaryEmail')}:</strong>{' '}
            {staffDetails?.email || 'N/A'}
          </Typography>
          <Typography variant='h6' sx={{ mb: 2 }}>
            <strong>{t('phone')}:</strong> {staffDetails?.phone || 'N/A'}
          </Typography>
          <Button
            variant='contained'
            color='primary'
            onClick={handlePasswordChange}
            sx={{ mt: 2 }}
          >
            {t('changePassword')}
          </Button>
        </Box>
      </Box>
      <>
      
  <Modal open={openModal} onClose={handleModalClose}>
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: '8px',
      }}
    >
      <Typography variant="h6" gutterBottom>
        {t('changePassword')}
      </Typography>
      <TextField
        fullWidth
        label="New Password"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        margin="normal"
      />
      <TextField
        fullWidth
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        margin="normal"
      />
      {passwordError && (
        <Typography color="error" sx={{ mt: 1 }}>
          {passwordError}
        </Typography>
      )}
      {successMessage && (
        <Typography color="success.main" sx={{ mt: 1 }}>
          {successMessage}
        </Typography>
      )}
      <Box mt={2} display="flex" justifyContent="flex-end" gap={1}>
        <Button variant="outlined" onClick={handleModalClose}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Submit
        </Button>
      </Box>
    </Box>
  </Modal>
</>
    </Container>
    
  );
};

export default User;
