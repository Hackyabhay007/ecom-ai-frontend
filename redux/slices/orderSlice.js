import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createApiUrl } from "../../utils/apiConfig";
import Cookies from 'js-cookie';

// Create order
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.post(createApiUrl('/orders'), {
        items: orderData.items.map(item => ({
          productId: item.product_id,
          variantId: item.variant_id,
          quantity: item.quantity
        })),
        shippingAddress: {
          firstName: orderData.shippingAddress.firstName,
          lastName: orderData.shippingAddress.lastName,
          street: orderData.shippingAddress.address,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          postalCode: orderData.shippingAddress.pincode,
          country: "India",
          phone: orderData.shippingAddress.phoneNumber
        },
        paymentGateway: orderData.paymentMethod
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

// Get user's orders
export const getMyOrders = createAsyncThunk(
  'orders/getMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.get(createApiUrl('/orders/my-orders'), {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch orders');
    }
  }
);

// Cancel order
export const cancelOrder = createAsyncThunk(
  'orders/cancelOrder',
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.post(createApiUrl(`/orders/cancel/${orderId}`), 
        { reason },
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to cancel order');
    }
  }
);

// Request return
export const requestReturn = createAsyncThunk(
  'orders/requestReturn',
  async ({ orderId, returnDetails }, { rejectWithValue }) => {
    try {
      const token = Cookies.get('auth_token');
      const response = await axios.post(
        createApiUrl(`/orders/${orderId}/return/request`),
        returnDetails,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to request return');
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    currentOrder: null,
    orders: [],
    loading: false,
    error: null,
    paymentStatus: null,
    returnStatus: null
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.paymentStatus = null;
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle createOrder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload.order;
        state.paymentData = action.payload.paymentData;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle getMyOrders
      .addCase(getMyOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.loading = false;
      })
      // Handle cancelOrder
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
        const orderIndex = state.orders.findIndex(o => o.id === action.payload.order.id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.order;
        }
      })
      // Handle requestReturn
      .addCase(requestReturn.fulfilled, (state, action) => {
        state.currentOrder = action.payload.order;
        state.returnStatus = action.payload.order.returnRequest.status;
        const orderIndex = state.orders.findIndex(o => o.id === action.payload.order.id);
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload.order;
        }
      });
  }
});

export const { clearCurrentOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
