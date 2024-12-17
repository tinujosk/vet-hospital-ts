import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Layout from './Layout';
import { isTokenExpired, hasPermission } from '../util';
import { clearUserData } from '../slices/authSlice';

const ProtectedRoute = ({ element, path, title }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = useSelector(state => state.auth.role);
  if (!role) {
    return <div>Page cannot be accessed or is Loading...</div>;
  }
  if (isTokenExpired()) {
    // Token is expired, log out
    dispatch(clearUserData());
    localStorage.removeItem('token');
    navigate('/');
  }
  return hasPermission(path, role) ? (
    <Layout title={title}>{element}</Layout>
  ) : (
    <Navigate to='/unauthorized' />
  );
};

export default ProtectedRoute;
