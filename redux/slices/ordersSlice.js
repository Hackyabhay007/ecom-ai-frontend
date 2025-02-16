import { createSlice } from '@reduxjs/toolkit';

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    status: 'idle',
    error: null,
    count: 0
  },
  reducers: {
    // ...your reducers...
  },
  extraReducers: (builder) => {
    // ...your extra reducers...
  }
});

export default ordersSlice.reducer;
