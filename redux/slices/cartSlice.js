import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { createApiUrl } from '../../utils/apiConfig';
import Cookies from 'js-cookie';

// Function to generate guestId
const generateGuestId = () => {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  let result = 'guest_';
  for (let i = 0; i < 25; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
};

// Function to get or create guestId
const getGuestId = () => {
  let guestId = localStorage.getItem('guestId');
  if (!guestId) {
    guestId = generateGuestId();
    localStorage.setItem('guestId', guestId);
  }
  return guestId;
};

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, variantId, quantity = 1 }, { rejectWithValue }) => {
    console.log('1. Starting addToCart thunk with:', { productId, variantId, quantity });
    
    try {
      const token = Cookies.get('auth_token');
      const guestId = !token ? getGuestId() : null;

      console.log('2. Auth details:', { 
        hasToken: !!token, 
        guestId: guestId 
      });

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      console.log('3. Request headers:', headers);
      console.log('4. Request payload:', {
        productId,
        variantId,
        quantity,
        ...(guestId && { guestId })
      });

      const response = await axios.post(
        createApiUrl('/cart/add'),
        {
          productId,
          variantId,
          quantity,
          ...(guestId && { guestId })
        },
        { headers }
      );

      console.log('5. API Response:', response.data);

      if (!response.data.success) {
        console.log('6. API reported failure');
        return rejectWithValue('Failed to add item to cart');
      }

      console.log('7. Returning cart data:', response.data.data.cart);
      return response.data.data.cart;
    } catch (error) {
      console.log('8. Error caught:', error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add item to cart'
      );
    }
  }
);

export const getAllCart = createAsyncThunk(
  'cart/getAllCart',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      const guestId = !token ? getGuestId() : null;

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const url = guestId 
        ? createApiUrl(`/cart?guest=${guestId}`)
        : createApiUrl('/cart');

      const response = await axios.get(url, { headers });

      if (!response.data.success) {
        return rejectWithValue('Failed to fetch cart items');
      }

      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch cart items'
      );
    }
  }
);



export const updateCart = createAsyncThunk(
  'cart/updateCart',
  async ({ itemId, updateData }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      const guestId = !token ? getGuestId() : null;

      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
      };

      const response = await axios.put(
        createApiUrl(`/cart/items/${itemId}`),
        {
          ...updateData,
          ...(guestId && { guestId })
        },
        { headers }
      );

      console.log(response);

      if (!response.data.success) {
        return rejectWithValue('Failed to update cart item');
      }

      return response.data.data.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update cart item'
      );
    }
  }
);

const initialState = {
  items: [],
  totalAmount: 0,
  loading: false,
  error: null,
  cartId: null,
  isActive: false,
  message: null,  // Add this
  isItemAdded: false  // Add this
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.cartId = null;
      state.isActive = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
      state.isItemAdded = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
        state.isItemAdded = false;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.cartId = action.payload.id;
        state.isActive = action.payload.isActive;
        state.error = null;
        state.message = "Item successfully added to cart!";
        state.isItemAdded = true;  // Set this to true on success
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isItemAdded = false;
      })
      .addCase(getAllCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.cartId = action.payload.id;
        state.isActive = action.payload.isActive;
        state.error = null;
      })
      .addCase(getAllCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCart.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(updateCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.totalAmount = action.payload.totalAmount;
        state.error = null;
        state.message = "Cart updated successfully";
      })
      .addCase(updateCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCart, clearError, clearMessage } = cartSlice.actions;
export default cartSlice.reducer;
