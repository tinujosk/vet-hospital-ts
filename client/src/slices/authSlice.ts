import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: null,
  email: null,
  role: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      const { userId, email, role } = action.payload;
      state.userId = userId;
      state.email = email;
      state.role = role;
      state.isAuthenticated = true;
    },
    clearUserData: state => {
      state.userId = null;
      state.email = null;
      state.role = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserData, clearUserData } = authSlice.actions;
export default authSlice.reducer;
