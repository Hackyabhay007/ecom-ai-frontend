import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiUrl } from '../../utils/apiConfig';

export const fetchProducts = createAsyncThunk(
  'shop/fetchProducts',
  async ({ page = 1, filters = {} }, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      
      // Include stored category ID if it exists
      const storedCategoryId = sessionStorage.getItem('selectedCategoryId');
      const finalFilters = {
        ...filters,
        ...(storedCategoryId && !filters.categoryId && { categoryId: storedCategoryId })
      };

      // Skip if filters haven't changed
      if (JSON.stringify(state.shop.appliedFilters) === JSON.stringify(filters) &&
          state.shop.products.length > 0) {
        return null;
      }

      // Format query parameters according to API spec
      const queryParams = new URLSearchParams({
        page: String(page),
        limit: '10',
        ...(finalFilters.search && { search: finalFilters.search }),
        ...(finalFilters.categoryId && { categories: finalFilters.categoryId }),
        ...(finalFilters.collections && { collections: finalFilters.collections }),
        ...(finalFilters.minPrice && { minPrice: finalFilters.minPrice }),
        ...(finalFilters.maxPrice && { maxPrice: finalFilters.maxPrice }),
        ...(finalFilters.color && { colors: finalFilters.color }),
        ...(finalFilters.size && { sizes: finalFilters.size }),
        ...(finalFilters.brands && { brands: finalFilters.brands }),
        ...(finalFilters.inStock !== undefined && { inStock: finalFilters.inStock }),
        ...(finalFilters.onSale && { onSale: String(finalFilters.onSale) })
      });

      const response = await axios.get(
        createApiUrl(`/products/search?${queryParams.toString()}`),
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
    console.log('fetchSingleProduct - Started with productId:', productId);
    try {
      const url = createApiUrl(`/products/${productId}`);
      console.log('Fetching from URL:', url);

      const response = await axios.get(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);

      if (!response.data.success) {
        console.error('API returned success: false');
        return rejectWithValue('Failed to fetch product details');
      }

      console.log('Processed product data:', response.data.data.product);
      return response.data.data.product;
    } catch (error) {
      console.error('fetchSingleProduct error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product details');
    }
  }
);


// Update fetchProductsBySearch to use the same parameter format
export const fetchProductsBySearch = createAsyncThunk(
  'shop/fetchProductsBySearch',
  async ({ searchQuery = '', filters = {} }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams({
        page: String(filters.page || 1),
        limit: String(filters.limit || 10),
        // ...rest of the filter parameters...
      });
      
      if (searchQuery) {
        queryParams.append('search', searchQuery);
      }

      // Handle category ID specifically
      if (filters.categoryId) {
        queryParams.append('categories', filters.categoryId);
      }

      // Add other filters
      if (filters.colors) queryParams.append('colors', filters.colors);
      if (filters.sizes) queryParams.append('sizes', filters.sizes);
      if (filters.minPrice) queryParams.append('minPrice', filters.minPrice);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.onSale !== undefined) queryParams.append('onSale', filters.onSale);

      const response = await axios.get(
        createApiUrl(`/products/search?${queryParams.toString()}`),
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );

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
    inStock: undefined,
    onSale: undefined
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
  // relatedProducts: [],
  // relatedProductsMeta: {
  //   currentPage: 1,
  //   totalPages: 1,
  //   total: 0,
  //   limit: 10
  // },
  // relatedProductsLoading: false,
  // relatedProductsError: null,
};

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.appliedFilters = {
        ...state.appliedFilters,
        ...action.payload
      };
      state.isFiltered = true;
      state.lastAppliedFilters = { ...state.appliedFilters };
      
      // Store both category and collection info
      if (action.payload.categoryId) {
        state.selectedCategoryId = action.payload.categoryId;
      }
      if (action.payload.collections) {
        state.selectedCollectionId = action.payload.collections;
      }
    },
    clearFilters: (state) => {
      state.appliedFilters = {};
      state.isFiltered = false;
      state.lastAppliedFilters = null;
      // Reset onSale filter specifically
      state.filters = {
        ...state.filters,
        priceRange: initialState.filters.priceRange,
        onSale: undefined
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
    },
    setPage: (state, action) => {
      state.meta.page = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (!action.payload) return; // Skip update if payload is null
        
        state.loading = false;
        state.products = action.payload.products;
        // Preserve applied filters while updating available ones
        state.filters = {
          ...state.filters,
          priceRange: action.payload.filters.priceRange,
          colors: action.payload.filters.colors || [],
          sizes: action.payload.filters.sizes || [],
          categories: action.payload.filters.categories || [],
          collections: action.payload.filters.collections || []
        };
        state.meta = action.payload.meta;
        // Ensure we keep the applied filters
        if (state.lastAppliedFilters) {
          state.appliedFilters = state.lastAppliedFilters;
        }
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add cases for fetchSingleProduct
      .addCase(fetchSingleProduct.pending, (state) => {
        console.log('fetchSingleProduct: PENDING');
        state.selectedProductLoading = true;
        state.selectedProductError = null;
      })
      .addCase(fetchSingleProduct.fulfilled, (state, action) => {
        console.log('fetchSingleProduct: FULFILLED', action.payload);
        state.selectedProductLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchSingleProduct.rejected, (state, action) => {
        console.log('fetchSingleProduct: REJECTED', action.payload);
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
        // Make sure we update the meta information
        state.meta = {
          ...state.meta,
          ...action.payload.meta
        };

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
      })
    // .addCase(fetchRelatedProducts.pending, (state) => {
    //   state.relatedProductsLoading = true;
    //   state.relatedProductsError = null;
    // })
    // .addCase(fetchRelatedProducts.fulfilled, (state, action) => {
    //   state.relatedProductsLoading = false;
    //   state.relatedProducts = action.payload.products;
    //   state.relatedProductsMeta = action.payload.meta;
    // })
    // .addCase(fetchRelatedProducts.rejected, (state, action) => {
    //   state.relatedProductsLoading = false;
    //   state.relatedProductsError = action.payload;
    // });
  }
});

export const { setFilters, clearFilters, setPriceRange, setPage } = shopSlice.actions;

// Update the selectMatchingProducts selector
export const selectMatchingProducts = (state, productIds) => {
  if (!productIds || !Array.isArray(productIds) || !state.shop.products) {
    return [];
  }
  return state.shop.products.filter(product => productIds.includes(product.id));
};

export const selectRelatedProducts = (state) => state.shop.relatedProducts;
export const selectRelatedProductsMeta = (state) => state.shop.relatedProductsMeta;
export const selectRelatedProductsLoading = (state) => state.shop.relatedProductsLoading;

export default shopSlice.reducer;
