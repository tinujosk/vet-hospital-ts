import React, { useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Avatar,
  Link,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { setUserData } from '../slices/authSlice';
import { loginUser } from '../services/authService';
import { useNavigation } from '../hooks/useNavigation';
import Logo from '../images/logo2.png';
import { showSnackbar } from '../slices/snackbarSlice';
import { fetchUserDetails } from '../slices/userSlice';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const { redirectToDashboard } = useNavigation();
  const dispatch = useDispatch();

  const handleSubmit = async event => {
    event.preventDefault();
    if (validate()) {
      try {
        const { token } = await loginUser(email, password);
        localStorage.setItem('token', token);
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role;

        // dispatch into redux store
        dispatch(
          setUserData({
            userId: decodedToken.userId,
            email: decodedToken.email,
            role,
          })
        );

        // Now fetch additional user details from the staff table and store it in redux
        dispatch(fetchUserDetails(decodedToken.userId));

        redirectToDashboard(role);
      } catch (error) {
        dispatch(
          showSnackbar({ message: 'Authentication failed', severity: 'error' })
        );
        console.error(error);
      }
    }
  };

  // Function to validate the input fields
  const validate = () => {
    let tempErrors = { email: '', password: '' };
    let isValid = true;

    if (!email) {
      tempErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Email is not valid';
      isValid = false;
    }

    if (!password) {
      tempErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 5) {
      tempErrors.password = 'Password must be at least 5 characters';
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  return (
    <Container
      component='main'
      maxWidth={false}
      sx={{ height: '100vh', py: 10, backgroundColor: '#F1F4F7' }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Box
          component='img'
          alt='Logo'
          src={Logo}
          sx={{ width: 200, height: 130 }}
        />
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: 2,
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Sign In
          </Typography>
        </Box>
        <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin='normal'
            required
            fullWidth
            id='email'
            label='Email'
            name='email'
            autoComplete='email'
            autoFocus
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            margin='normal'
            required
            fullWidth
            name='password'
            label='Password'
            type='password'
            id='password'
            autoComplete='current-password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />
          <Button
            type='submit'
            fullWidth
            variant='contained'
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Link href='/forgot-password' variant='body2'>
              Forgot Password?
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
