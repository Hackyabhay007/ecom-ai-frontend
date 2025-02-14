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
  async (wishlistId, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      console.log('Remove from wishlist - Starting with:', {
        wishlistId,
        token: token ? 'Present' : 'Missing'
      });

      if (!token) {
        console.error('Authentication token missing');
        return rejectWithValue('Authentication required');
      }

      // Make sure productId is valid
      if (!wishlistId) {
        console.error('Invalid wishlistID:', wishlistId);
        return rejectWithValue('Invalid wishlist ID');
      }

      const apiUrl = createApiUrl(`/wishlist/${wishlistId}`); // Updated endpoint
      console.log('Sending DELETE request to:', apiUrl);

      const response = await axios.delete(apiUrl, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Remove from wishlist - Response:', response.data);
      console.log('This is the sucess fullyness satatus :', response.data.success);

      if (response?.data?.success == false) {
        console.error('Server returned success: false', response.data);
        return rejectWithValue(response.data.message || 'Failed to remove item from wishlist');
      }

      return {
        wishlistId: wishlistId,
        message: response.data.message || 'Item removed from wishlist'
      };
    } catch (error) {
      console.error('Remove from wishlist - Error:', {
        message: error.message,
        response: error.response?.data
      });

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
  isOpen: false,  // Add this for sidebar state
  deleteSuccess: false // Add this new state
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
    },
    clearDeleteSuccess: (state) => {
      state.deleteSuccess = false;
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
        state.deleteSuccess = true; // Set to true on successful deletion
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
  toggleWishlistSidebar,  // Add this export
  clearDeleteSuccess // Export new action
} = wishlistSlice.actions;

// Selectors
export const selectWishlistItems = (state) => state.wishlist.items;
export const selectWishlistCount = (state) => state.wishlist.count;
export const selectWishlistLoading = (state) => state.wishlist.loading;
export const selectWishlistError = (state) => state.wishlist.error;
export const selectWishlistMessage = (state) => state.wishlist.message;
export const selectWishlistSidebarOpen = (state) => state.wishlist.isOpen;
export const selectDeleteSuccess = (state) => state.wishlist.deleteSuccess; // Add new selector

export default wishlistSlice.reducer;
