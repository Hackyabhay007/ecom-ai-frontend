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
        ...(filters.saleOnly && { saleOnly: filters.saleOnly }), // Add this line
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

// Add new fetchSingleProduct thunk
export const fetchSingleProduct = createAsyncThunk(
  'shop/fetchSingleProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        createApiUrl(`/products/${productId}`),
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.success) {
        return rejectWithValue('Failed to fetch product details');
      }

      return response.data.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);


// Add new fetchProductsBySearch thunk
export const fetchProductsBySearch = createAsyncThunk(
  'shop/fetchProductsBySearch',
  async ({ searchQuery = '', filters = {}, signal }, { getState, rejectWithValue }) => {

    try {
      // Build query parameters
      let queryParams = new URLSearchParams();

      // Change 'query' to 'search' parameter
      if (typeof searchQuery === 'string' && searchQuery) {
        queryParams.append('search', searchQuery); // Changed from 'query' to 'search'
      }

      // Only add other parameters if needed
      // const limit = filters.limit || 9;
      // queryParams.append('limit', String(limit));
      // const page = filters.page || 1;
      // queryParams.append('page', String(page));

      const finalUrl = createApiUrl(`/products/search?${queryParams.toString()}`);

      const response = await axios.get(finalUrl, {
        headers: {
          'Content-Type': 'application/json',
        },
        signal,
      });

      if (!response.data.success) {
        return rejectWithValue('Failed to search products');
      }

      return {
        products: response.data.data.products,
        filters: response.data.data.filters,
        meta: response.data.data.meta
      };

    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to search products');
    }
  }
);


const initialState = {
  products: [],
  filters: {
    priceRange: { min: 0, max: 1000 },
    colors: [],
    sizes: [],
    categories: [],
    collections: [],
    brands: [],
  },
  meta: {
    total: 0,
    page: 1,
    limit: 9,
    totalPages: 1
  },
  loading: false,
  searchLoading: false,
  error: null,
  appliedFilters: {},
  lastAppliedFilters: null, // Add this to track last applied filters
  selectedProduct: null,
  selectedProductLoading: false,
  selectedProductError: null,
  isFiltered: false, // Add this to track if filters are applied
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      // Merge new filters with existing ones instead of replacing
      state.appliedFilters = {
        ...state.appliedFilters,
        ...action.payload
      };
      state.isFiltered = true;
      state.lastAppliedFilters = { ...state.appliedFilters };
    },
    clearFilters: (state) => {
      state.appliedFilters = {};
      state.isFiltered = false;
      state.lastAppliedFilters = null;
      // Don't reset available filters, only applied ones
      state.filters = {
        ...state.filters,
        priceRange: initialState.filters.priceRange
      };
    },
    setPriceRange: (state, action) => {
      // Preserve other filters when updating price range
      state.appliedFilters = {
        ...state.appliedFilters,
        minPrice: action.payload.min,
        maxPrice: action.payload.max
      };
      state.isFiltered = true;
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
      })
      // Add cases for fetchSingleProduct
      .addCase(fetchSingleProduct.pending, (state) => {
        state.selectedProductLoading = true;
        state.selectedProductError = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        state.selectedProductLoading = false;
        state.selectedProductError = action.payload;
      })

       // Add cases for fetchProductsBySearch
       .addCase(fetchProductsBySearch.pending, (state) => {
        state.searchLoading = true;
        state.searchError = null;
        // Don't clear products here to prevent flashing
      })
      .addCase(fetchProductsBySearch.fulfilled, (state, action) => {
        if (action.payload === null) return; // Skip state update if no new data
        
        state.searchLoading = false;
        state.searchError = null;
        state.products = action.payload.products;
        state.meta = action.payload.meta;
        
        // Preserve applied filters while updating available ones
        state.filters = {
          ...state.filters,
          priceRange: action.payload.filters.priceRange,
          colors: action.payload.filters.colors || state.filters.colors,
          sizes: action.payload.filters.sizes || state.filters.sizes,
          categories: action.payload.filters.categories || state.filters.categories,
          collections: action.payload.filters.collections || state.filters.collections,
          brands: action.payload.filters.brands || state.filters.brands,
        };
      })
      .addCase(fetchProductsBySearch.rejected, (state, action) => {
        state.searchLoading = false;
        state.searchError = action.payload;
        state.products = []; // Clear products on error
      });
  }
});

export const { setFilters, clearFilters, setPriceRange } = shopSlice.actions;
export default shopSlice.reducer;
