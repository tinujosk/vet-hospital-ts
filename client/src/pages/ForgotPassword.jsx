import React, { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import { sendForgotPasswordEmail } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await sendForgotPasswordEmail(email);
      setMessage(response.message);
      setError('');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError('Failed to send password reset email.');
      setMessage('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth='sm'>
      <Box sx={{ mt: 8 }}>
        <Typography variant='h4' align='center' gutterBottom>
          Forgot Password
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label='Email'
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin='normal'
          />

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2}}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Button
                type='submit'
                variant='contained'
                color='primary'
                fullWidth
              >
                Send Email Link
              </Button>
            )}
            <Button href='/' type='submit' variant='contained' fullWidth>
              Back to Login
            </Button>
          </Box>
        </form>
        {message && <Typography color='success.main'>{message}</Typography>}
        {error && <Typography color='error'>{error}</Typography>}
      </Box>
    </Container>
  );
};

export default ForgotPassword;
