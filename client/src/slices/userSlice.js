import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLoggedInUserDetails } from '../services/userService';

// Fetch user details
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (userId, { rejectWithValue }) => {
    try {
      return await fetchLoggedInUserDetails(userId);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  staffDetails: {},
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserDetails: state => {
      state.staffDetails = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchUserDetails.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        console.log({ details: action.payload });
        state.loading = false;
        state.staffDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch user details';
      });
  },
});

export const { clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
