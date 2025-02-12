import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiUrl } from '../../utils/apiConfig';
import { setCookie, removeCookie } from '../../utils/cookieUtils';

const header_key = process.env.NEXT_PUBLIC_HEADER_KEY;
const header_value = process.env.NEXT_PUBLIC_HEADER_VALUE

// Create async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log("This is the credential form the authSlice page", credentials)
      const response = await axios.post(createApiUrl('/auth/login'), credentials, {
        headers: {
          'Content-Type': 'application/json',
        },
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (response.headers['content-type']?.includes('text/html')) {
        return rejectWithValue('Server returned HTML instead of JSON. Please check if the server is running.');
      }

      if (response?.data?.success) {
        const { token, user } = response.data.data;
        // Set cookie with token
        setCookie('auth_token', token);
        return { user, token };
      } else {
        console.log(response?.data?.error?.message)
        return rejectWithValue(response?.data?.error);
      }

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

    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const retrieveCustomer = createAsyncThunk(
  'customer/retrieveCustomer',
  async () => {
    try {
      const response = await axios.get('/api/customers/me');
      return response.data;
    } catch (error) {
      throw Error(error.response?.data?.message || 'Failed to retrieve customer');
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customer/updateCustomer',
  async (updateData) => {
    try {
      const response = await axios.post('/api/customers/me', updateData);
      return response.data;
    } catch (error) {
      throw Error(error.response?.data?.message || 'Failed to update customer');
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
    isAuthenticated: false,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      state.user = null;
      state.token = null;
      state.error = null;
      state.isAuthenticated = false;
      removeCookie('auth_token');
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.user;
        state.token = action?.payload?.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred';
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action?.payload?.user;
        state.token = action?.payload?.token;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'An error occurred';
      })
  },
});

const customerSlice = createSlice({
  name: 'customer',
  initialState: {
    currentCustomer: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(retrieveCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(retrieveCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
        state.error = null;
      })
      .addCase(retrieveCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCustomer = action.payload;
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
