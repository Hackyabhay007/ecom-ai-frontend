import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiUrl } from '../../utils/apiConfig';
import { setCookie, removeCookie } from '../../utils/cookieUtils';
import Cookies from 'js-cookie';
import { getVisitedProducts } from '../../utils/visitedProducts';

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

      // Handle common error cases with user-friendly messages
      if (response.status === 401) {
        return rejectWithValue('Incorrect email or password. Please try again.');
      }

      if (response.status === 404) {
        return rejectWithValue('Account not found. Please check your email or create a new account.');
      }

      if (response.status >= 400 && response.status < 500) {
        return rejectWithValue(response.data?.message || 'Please check your login details and try again.');
      }

      if (response.status >= 500) {
        return rejectWithValue('Our servers are having trouble. Please try again in a few minutes.');
      }

      if (!response.data?.success) {
        return rejectWithValue('Unable to log in at this time. Please try again later.');
      }

      const { token, user } = response.data.data;
      setCookie('auth_token', token);
      return { user, token };

    } catch (error) {
      // Handle network and other errors with user-friendly messages
      if (error.code === 'ECONNREFUSED') {
        return rejectWithValue('Unable to connect to our servers. Please check your internet connection.');
      }
      
      if (error.code === 'ETIMEDOUT') {
        return rejectWithValue('The connection timed out. Please try again.');
      }

      return rejectWithValue('Something went wrong. Please try again later.');
    }
  }
);


// This is the logic for the regiseter User
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(createApiUrl('/auth/register'), userData, {
        validateStatus: (status) => status >= 200 && status < 500,
      });

      if (response.status === 201) {
        // Return undefined on success (as we're doing currently)
        return undefined;
      }

      // Handle various error cases with user-friendly messages
      if (response.status === 400) {
        return rejectWithValue(response.data?.message || 'Invalid registration details.');
      }

      return rejectWithValue('Registration failed. Please try again.');
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed. Please try again later.');
    }
  }
);


// Add userInfo thunk
export const userInfo = createAsyncThunk(
  'auth/userInfo',
  async (_, { rejectWithValue, getState }) => {
    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        return rejectWithValue({ message: 'No auth token found' });
      }

      // Check if we already have user data
      const { user } = getState().auth;
      if (user) {
        return user;
      }

      const response = await axios.get(createApiUrl('/auth/me'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.user) {
        return rejectWithValue({ message: 'User data not found' });
      }

      return response.data.user;
    } catch (error) {
      if (error.code === 'ERR_CONNECTION_REFUSED') {
        return rejectWithValue({ 
          message: 'Unable to connect to server. Please check your internet connection.' 
        });
      }
      
      if (error.response?.status === 401) {
        removeCookie('auth_token');
        return rejectWithValue({ message: 'Session expired. Please login again.' });
      }

      return rejectWithValue({ 
        message: error.response?.data?.message || 'Failed to fetch user info'
      });
    }
  },
  {
    // Only allow one pending userInfo call at a time
    condition: (_, { getState }) => {
      const { loading } = getState().auth;
      if (loading) {
        return false;
      }
      return true;
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

export const updateVisitedProducts = createAsyncThunk(
  'auth/updateVisitedProducts',
  async () => {
    return getVisitedProducts();
  }
);

export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (formData, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) return rejectWithValue('No auth token found');

      // Log the formData contents for debugging
      for (let [key, value] of formData.entries()) {
        console.log('FormData:', key, value);
      }

      const response = await axios.put(createApiUrl('/auth/profile/full'), formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Profile update response:', response.data);
      return response.data.user;
    } catch (error) {
      console.error('Profile update error:', error.response?.data);
      const message = error.response?.data?.message || 'Failed to update profile';
      return rejectWithValue({ message, required: error.response?.data?.required });
    }
  }
);


// Create auth slice
const initialState = {
  customer: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    registerData: null,
    token: null,
    loading: false,
    error: null,
    isAuthenticated: false,
    visitedProducts: [],
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
      // Clear auth tokens from visited products
      state.visitedProducts = state.visitedProducts.map(product => ({
        ...product,
        authToken: null
      }));
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
        // Update visited products with auth token
        const guestId = Cookies.get('guest_id');
        state.visitedProducts = state.visitedProducts.map(product => ({
          ...product,
          authToken: action.payload.token,
          guestId
        }));
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
      .addCase(userInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(userInfo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      .addCase(updateVisitedProducts.fulfilled, (state, action) => {
        state.visitedProducts = action.payload;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
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
