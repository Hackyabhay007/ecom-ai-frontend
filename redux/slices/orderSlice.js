import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "@/lib/data/cookies";
// Async thunk to fetch orders by customer ID
export const fetchOrdersByCustomerId = createAsyncThunk(
  "orders/fetchOrdersByCustomerId",
  async (customerId, { rejectWithValue }) => {
    const headers = await getAuthHeaders();

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/orders?fields=customer_id,created_at,item_subtotal,display_id`,
        {
          params: {
            order: "-created_at",
          },
          headers: {
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
            ...headers,
          },
        }
      );

      // console.log(response.data.orders);
      // Filter orders by customer_id
      const filteredOrders = response.data.orders.filter(
        (order) => order.customer_id === customerId
      );

      return filteredOrders;
    } catch (error) {
        return rejectWithValue({
          type: "error",
          message: error.response?.data?.message || error.message.toString(),
        });
    }
  }
);

export const getordercountofuser = createAsyncThunk(
  "orders/fetchOrdersByCustomerId",
  async (customerId, { rejectWithValue }) => {
    const headers = await getAuthHeaders();

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/orders?fields=customer_id,created_at,item_subtotal,display_id`,
        {
          params: {
            limit : 100,
            order: "-created_at",
          },
          headers: {
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
            ...headers,
          },
        }
      );

      // console.log(response.data.orders);
      // Filter orders by customer_id
      const filteredOrders = response.data.orders.filter(
        (order) => order.customer_id === customerId
      );

      return filteredOrders.length > 10 ? 11 : filteredOrders.length;
    } catch (error) {
        return rejectWithValue({
          type: "error",
          message: error.response?.data?.message || error.message.toString(),
        });
    }
  }
);

export const Cencelorder = createAsyncThunk(
  "orders/fetchOrdersByCustomerId",
  async (orderId, { rejectWithValue }) => {
    const headers = await getAuthHeaders();

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/customers/cancel-order/${orderId}`,
        {
          headers: {
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
            ...headers,
          },
        }
      );

      // console.log(response.data);
      // Filter orders by customer_id

      return filteredOrders;
    } catch (error) {
      //   return rejectWithValue({
      //     type: "error",
      //     message: error.response?.data?.message || error.message.toString(),
      //   });
      // console.log(error);
    }
  }
);

// Create the slice
const ordersSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearOrders: (state) => {
      state.orders = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrdersByCustomerId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrdersByCustomerId.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrdersByCustomerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export the actions
export const { clearOrders } = ordersSlice.actions;

// Export the reducer
export default ordersSlice.reducer;
