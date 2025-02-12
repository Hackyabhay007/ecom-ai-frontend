import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiUrl } from '../../utils/apiConfig';

export const fetchProducts = createAsyncThunk(
  'shop/fetchProducts',
  async ({ page = 1, filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page,
        limit: 10,
        ...(filters.categoryId && { categoryId: filters.categoryId }),
        ...(filters.size && { size: filters.size }),
        ...(filters.color && { color: filters.color }),
        ...(filters.minPrice && { minPrice: filters.minPrice }),
        ...(filters.maxPrice && { maxPrice: filters.maxPrice }), 
      });

      const response = await axios.get(
        createApiUrl(`/products?${queryParams.toString()}`),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue('Failed to fetch products');
      }

      return {
        products: response.data.data.products,
        filters: response.data.data.filters,
        meta: response.data.data.meta
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch products');
    }
  }
);

const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    products: [],
    filters: {
      priceRange: { min: 0, max: 1000 },
      colors: [], // Will be populated from API
      sizes: [], // Will be populated from API
      categories: [], // Will be populated from API
      collections: []
    },
    meta: {
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 1
    },
    loading: false,
    error: null,
    appliedFilters: {} // Track currently applied filters
  },
  reducers: {
    setFilters: (state, action) => {
      state.appliedFilters = { ...state.appliedFilters, ...action.payload };
    },
    clearFilters: (state) => {
      state.appliedFilters = {};
      state.filters = shopSlice.initialState.filters;
    },
    setPriceRange: (state, action) => {
      state.appliedFilters.minPrice = action.payload.min;
      state.appliedFilters.maxPrice = action.payload.max;
    }
  },
  extraReducers: (builder) => { 
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        // Update filters from API response
        state.filters = {
          priceRange: action.payload.filters.priceRange,
          colors: action.payload.filters.colors || [],
          sizes: action.payload.filters.sizes || [],
          categories: action.payload.filters.categories || [],
          collections: action.payload.filters.collections || []
        };
        state.meta = action.payload.meta;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearFilters, setPriceRange } = shopSlice.actions;
export default shopSlice.reducer;
