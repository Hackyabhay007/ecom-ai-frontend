import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiUrl } from '../../utils/apiConfig';

// Define initial state
const initialState = {
  collections: [],
  loading: false,
  error: null,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1
  }
};

// Create fetch collections thunk
export const fetchcollections = createAsyncThunk(
  'collections/fetchCollections',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        createApiUrl('/collections'),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

      console.log('Collections API Response:', response.data);

      if (!response.data.success) {
        return rejectWithValue('Failed to fetch collections');
      }

      return response.data.data;
    } catch (error) {
      console.error('Collection fetch error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch collections');
    }
  }
);

// Create the slice
const collectionSlice = createSlice({
  name: 'collection',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchcollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcollections.fulfilled, (state, action) => {
        state.loading = false;
        state.collections = action.payload.collections;
        state.meta = action.payload.meta || state.meta;
      })
      .addCase(fetchcollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export selectors
export const selectCollections = (state) => state.collection.collections;
export const selectCollectionLoading = (state) => state.collection.loading;
export const selectCollectionError = (state) => state.collection.error;

export default collectionSlice.reducer;
