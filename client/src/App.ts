import React, { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Doctor from './pages/Doctor';
import Treatment from './pages/Treatment';
import Nurse from './pages/Nurse';
import Lab from './pages/Lab';
import Pharmacy from './pages/Pharmacy';
import PatientList from './pages/PatientList';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import { getUserDetailsFromToken } from './util';
import { setUserData, clearUserData } from './slices/authSlice';
import User from './pages/User';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import GlobalSnackbar from './components/GlobalSnackbar';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4F97AC',
      light: '#7FB7C4',
      dark: '#346878',
    },
    secondary: {
      main: '#58A47E',
      light: '#58A47E',
      dark: '#3E7A5B',
    },
    layout: {
      main: '#0A1D23',
    },
    // error: {
    //   main: '#d32f2f',
    // },
    // background: {
    //   default: '#f4f4f4',
    //   paper: '#ffffff',
    // },
    text: {
      black: '#000000',
      secondary: '#4f4f4f',
      white: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTableRow: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&:nth-of-type(even)': {
            backgroundColor: '#f9f9f9',
          },
          '&:nth-of-type(odd)': {
            backgroundColor: '#f2f2f2',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#1976d2',
          color: '#fff',
          fontWeight: 'bold',
        },
      },
    },
  },
});

export default function App() {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    try {
      const { userId, email, role } = getUserDetailsFromToken() || {};
      if (userId) dispatch(setUserData({ userId, email, role }));
    } catch (error) {
      console.error('Invalid token', error);
      dispatch(clearUserData());
      localStorage.removeItem('token');
    }
  }, [dispatch]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route
            path='/doctor'
            element={
              <ProtectedRoute
                element={<Doctor />}
                title={t('doctorsDashboard')}
                path='/doctor'
              />
            }
          />
          <Route
            path='/treatment/:id'
            element={
              <ProtectedRoute
                element={<Treatment />}
                title={t('patientTreatment')}
                path='/treatment'
              />
            }
          />
          <Route
            path='/admin'
            element={
              <ProtectedRoute
                element={<Admin />}
                title={t('adminDashboard')}
                path='/admin'
              />
            }
          />
          <Route
            path='/nurse'
            element={
              <ProtectedRoute
                element={<Nurse />}
                title={t('nursesDashboard')}
                path='/nurse'
              />
            }
          />
          <Route
            path='/lab'
            element={
              <ProtectedRoute
                element={<Lab />}
                title={t('labDashboard')}
                path='/lab'
              />
            }
          />
          <Route
            path='/pharmacy'
            element={
              <ProtectedRoute
                element={<Pharmacy />}
                title='Pharmacy Dashboard'
                path='/pharmacy'
              />
            }
          />
          <Route
            path='/patients'
            element={
              <ProtectedRoute
                element={<PatientList />}
                title={t('patientsList')}
                path='/patients'
              />
            }
          />
          <Route
            path='/unauthorized'
            element={
              <NotFound
                reason={{
                  reasonCode: '401',
                  reasonTitle: 'Unauthorized Access',
                  reasonDescription:
                    'You do not have permission to view this page.',
                }}
              />
            }
          />
          <Route
            path='*'
            element={
              <NotFound
                reason={{
                  reasonCode: '404',
                  reasonTitle: 'Page Not Found',
                  reasonDescription:
                    "Sorry, the page you're looking for doesn't exist",
                }}
              />
            }
          />
          <Route
            path='/user'
            element={
              <ProtectedRoute
                element={<User />}
                title={t('myAccount')}
                path='/user'
              />
            }
          />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password/:token' element={<ResetPassword />} />
        </Routes>
      </Router>
      <GlobalSnackbar />
    </ThemeProvider>
  );
}
