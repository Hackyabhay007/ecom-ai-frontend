import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiUrl } from '../../utils/apiConfig';


const header_key = process.env.NEXT_PUBLIC_HEADER_KEY;
const header_value = process.env.NEXT_PUBLIC_HEADER_VALUE


// Create async thunk for login
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("This is the credential form the authSlice page", credentials)
      const response = await axios.post(createApiUrl('/auth/login'), credentials, {
        headers: {
          // 'X-Admin-Token': 'nduwdn32ed3dhebqbdnqbndhjbd3dudheb',
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (response.headers['content-type']?.includes('text/html')) {
        return rejectWithValue('Server returned HTML instead of JSON. Please check if the server is running.');
      }

      if (response?.data?.success) {
        console.log(response);
        // localStorage.setItem('token', response.data.token);
        // localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data;
      }
      else {
        console.log(response?.data?.error?.message)
        return rejectWithValue(response?.data?.error);
      }

      // return rejectWithValue('Invalid response from server');
    } catch (error) {
      console.error('Login error:', error);
      return rejectWithValue(error?.response?.data?.message || 'Failed to connect to server');
    }
  }
);


export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(createApiUrl('/auth/register'), userData, {
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (response.headers['content-type']?.includes('text/html')) {
        return rejectWithValue('Server returned HTML instead of JSON. Please check if the server is running.');
      }

      console.log(response)

      if(response?.status == 400){
        return rejectWithValue(response?.data?.message)
      }

      else if(response?.status == 201){
        return 
      }

      // if (response?.data?.success) {
      //   console.log(response);
      //   // localStorage.setItem('token', response.data.token);
      //   // localStorage.setItem('user', JSON.stringify(response.data.user));
      //   return response.data;
      // }
      // else {
      //   console.log(response?.data?.error?.message)
      //   return rejectWithValue(response?.data?.error);
      // }

      // if (!response.ok) {
      //   throw new Error('Registration failed');
      // }

      // console.log(response)
      // const data = await response.json();
      // console.log("This is the response of the userRegister Data ", data);
      // return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Create auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    registerData: null,
    token: null,
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
      })


      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.user;
        state.token = action?.payload?.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred';
      })
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
