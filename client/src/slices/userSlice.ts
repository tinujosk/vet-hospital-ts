import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchLoggedInUserDetails } from '../services/userService';

// Fetch user details
export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async (userId:string, { rejectWithValue }) => {
    try {
      return await fetchLoggedInUserDetails(userId);
    } catch (error: unknown) {
      if(error instanceof Error && 'response' in Error) {
        return rejectWithValue((error as any).response.data);
      }
      return rejectWithValue('Some unknown error occured.')
    }
  }
);

const initialState: {staffDetails: {} | null; loading: boolean; error: {} | null} = {
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
