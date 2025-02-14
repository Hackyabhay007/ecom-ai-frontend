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
    console.log('1. Starting review submission with data:', reviewData);
    
    try {
      const authToken = getCookie('auth_token');
      console.log('2. Auth token retrieved:', authToken ? 'Present' : 'Missing');
      
      if (!authToken) {
        console.log('3. No auth token found - rejecting');
        return rejectWithValue('Please login to submit a review');
      }

      console.log('4. Sending POST request to review API');
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

      console.log('5. Review API Response:', response.data);

      if (!response.data.success) {
        console.log('6. API reported failure:', response.data.error);
        return rejectWithValue(response.data.error?.message || 'Failed to post review');
      }

      console.log('7. Review submitted successfully:', response.data.data);
      return {
        data: response.data.data,
        message: 'Review submitted successfully!'
      };
    } catch (error) {
      console.error('8. Review submission error:', {
        error: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(
        error.response?.data?.error?.message || 
        'Failed to submit review. Please try again.'
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
