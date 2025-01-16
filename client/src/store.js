import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import snackbarReducer from './slices/snackbarSlice';
import userReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer, // Add your reducers here
    snackbar: snackbarReducer,
    user: userReducer,
  },
});

export default store;
