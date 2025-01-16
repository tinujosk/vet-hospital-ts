import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { resetPasswordWithToken } from '../services/userService';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const response = await resetPasswordWithToken(token, newPassword);
      setMessage(response.message);
      setError('');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to reset password.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box sx={{ mt: 8 }}>
        <Typography variant='h4' align='center' gutterBottom>
          Reset Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label='New Password'
            fullWidth
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin='normal'
            required
          />
          <TextField
            label='Confirm Password'
            fullWidth
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin='normal'
            required
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
              >
                Reset Password
              </Button>
            )}
          </Box>
        </form>
        {message && (
          <Typography color='success.main' align='center' sx={{ mt: 2 }}>
            {message}
          </Typography>
        )}
        {error && (
          <Typography color='error' align='center' sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default ResetPassword;