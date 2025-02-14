import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createApiUrl } from '../../utils/apiConfig';
import { getCookie } from '../../utils/cookieUtils';

// Make sure the fetchReviews thunk includes pagination params
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({ productId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        createApiUrl(`/reviews/product/${productId}?page=${page}&limit=${limit}`),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue('Failed to fetch reviews');
      }

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

export const postReview = createAsyncThunk(
  'reviews/postReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const authToken = getCookie('auth_token');
      
      if (!authToken) {
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post(
        createApiUrl('/reviews'),
        reviewData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          },
        }
      );

      console.log('Review API Response:', response.data); // Debug log

      if (!response.data.success) {
        return rejectWithValue(response.data.error?.message || 'Failed to post review');
      }

      return response.data.data;
    } catch (error) {
      console.error('Review API Error:', error.response?.data); // Debug log
      return rejectWithValue(
        error.response?.data?.error?.message || 
        'Failed to post review'
      );
    }
  }
);

const initialState = {
  reviews: [],
  stats: {
    total: 0,
    average: 0,
    distribution: {
      1: { count: 0, percentage: 0 },
      2: { count: 0, percentage: 0 },
      3: { count: 0, percentage: 0 },
      4: { count: 0, percentage: 0 },
      5: { count: 0, percentage: 0 }
    }
  },
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  },
  loading: false,
  error: null
};

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.stats = action.payload.stats;
        state.meta = action.payload.meta;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = [action.payload, ...state.reviews];
      })
      .addCase(postReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default reviewSlice.reducer;
