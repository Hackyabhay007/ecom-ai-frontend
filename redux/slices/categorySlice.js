import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createApiUrl } from '../../utils/apiConfig';

// Updated fetchCategories to handle dynamic parameters
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories",
  async ({ searchParams = {} } = {}, { rejectWithValue }) => {
    try {
      // Create query string from all provided search parameters
      const queryParams = new URLSearchParams();
      
      // Add all search parameters dynamically
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value) {
          queryParams.append(key, value);
        }
      });

      const queryString = queryParams.toString();
      const url = createApiUrl(`/categories${queryString ? `?${queryString}` : ''}`);

      console.log('Fetching categories with URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.data.success) {
        return rejectWithValue('Failed to fetch categories');
      }

      console.log("Fetched categories:", response.data.data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [], // Array of category objects
    count: 0,      // Total count of categories
    loading: false,
    error: null,
  },
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.count = action.payload.count;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearCategoryError } = categorySlice.actions;

// Export selectors
export const selectCategories = (state) => state.categories.categories;
export const selectCategoryCount = (state) => state.categories.count;
export const selectCategoryLoading = (state) => state.categories.loading;
export const selectCategoryError = (state) => state.categories.error;

export default categorySlice.reducer;
