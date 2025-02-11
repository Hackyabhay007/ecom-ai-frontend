import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchHomeCategories = createAsyncThunk(
  "homeCategories/fetchHomeCategories",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories`,
      {
        headers: {
          "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
        },
      }
    );
    return response.data;
  }
);

const homeCategorySlice = createSlice({
  name: "homeCategories",
  initialState: {
    categories: {
      product_categories: [],
      count: 0,
      offset: 0,
      limit: 50
    },
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeCategories.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHomeCategories.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.categories = action.payload;
      })
      .addCase(fetchHomeCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default homeCategorySlice.reducer;
