import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';





// Create async thunk for login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:9000/auth/admin/login', credentials, {
        headers: {
          'X-Admin-Token': 'nduwdn32ed3dhebqbdnqbndhjbd3dudheb',
          'Content-Type': 'application/json',
        },
      });
      
      if (response?.data) {
        localStorage.setItem('token', response?.data?.token);
        localStorage.setItem('user', JSON.stringify(response?.data?.user));
        return response?.data;
      }
    } catch (error) {
      // console.log("Login error:", error?.response?.data?.message);
      return rejectWithValue(error?.response?.data || 'An error occurred');
    }
  }
);

// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : null,
    token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.user;
        state.token = action?.payload?.token;
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred';
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
