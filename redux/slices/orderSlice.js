import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { createApiUrl } from "../../utils/apiConfig";

// Create async thunks for order operations
export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await axios.post(createApiUrl('/orders'), orderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to create order');
    }
  }
);

export const processPayment = createAsyncThunk(
  'orders/processPayment',
  async ({ orderId, paymentMethod, paymentData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(createApiUrl(`/orders/${orderId}/payment`), {
        paymentMethod,
        ...paymentData
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Payment failed');
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
    paymentStatus: null
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
      state.paymentStatus = null;
    },
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(processPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.paymentStatus = 'processing';
      })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.paymentStatus = 'success';
        state.currentOrder = {
          ...state.currentOrder,
          paymentStatus: 'paid',
          ...action.payload
        };
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.paymentStatus = 'failed';
      });
  }
});

export const { clearCurrentOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
