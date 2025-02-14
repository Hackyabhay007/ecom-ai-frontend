import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiUrl } from '../../utils/apiConfig';
import Cookies from 'js-cookie';





// Fetch all wishlist items
export const fetchAllWishlistItems = createAsyncThunk(
  'wishlist/fetchAllWishlistItems',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication token not found');
      }

      const response = await axios.get(createApiUrl('/wishlist'), {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.data.success) {
        return rejectWithValue('Failed to fetch wishlist items');
      }

      return {
        items: response?.data?.data?.wishlist,
        count: response?.data?.data?.count
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Error fetching wishlist items'
      );
    }
  }
);


// Add to wishlist
export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async ({ productId, variantId }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await axios.post(
        createApiUrl('/wishlist/add'),
        {
          productId,
          variantId
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.success) {
        return rejectWithValue('Failed to add item to wishlist');
      }

      // Return both message and wishlist item from the response
      return {
        message: response.data.data.message,
        item: response.data.data.wishlistItem
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to wishlist'
      );
    }
  }
);


// Remove from wishlist
export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      
      if (!token) {
        return rejectWithValue('Authentication required');
      }

      const response = await axios.delete(
        createApiUrl(`/wishlist/${productId}`),
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.success) {
        return rejectWithValue('Failed to remove item from wishlist');
      }

      return {
        productId,
        message: response.data.data.message
      };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to remove item from wishlist'
      );
    }
  }
);

const initialState = {
  items: [],
  count: 0,
  loading: false,
  error: null,
  message: null,
  isOpen: false  // Add this for sidebar state
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
    clearWishlistMessage: (state) => {
      state.message = null;
    },
    toggleWishlistSidebar: (state) => {
      state.isOpen = !state.isOpen;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all wishlist items
      .addCase(fetchAllWishlistItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllWishlistItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.count = action.payload.count;
        state.error = null;
      })
      .addCase(fetchAllWishlistItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload.item);
        state.count += 1;
        state.message = action.payload.message;
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.product.id !== action.payload.productId);
        state.count = Math.max(0, state.count - 1);
        state.message = action.payload.message;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { 
  clearWishlistError, 
  clearWishlistMessage, 
  toggleWishlistSidebar  // Add this export
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.count;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectWishlistMessage = (state) => state.wishlist.message;
export const selectWishlistSidebarOpen = (state) => state.wishlist.isOpen;

export default wishlistSlice.reducer;
