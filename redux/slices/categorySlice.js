import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Image from "next/image";
import axios from "axios";

// Async action to fetch category data
export const fetchcategores = createAsyncThunk(
  "categories/fetchcategores",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories`,
      {
        headers: {
          "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
        },
      }
    ); // Replace with your API endpoint
    console.log(response.data, " this is get rescome from category");
    return response.data.product_categories; // Assume the API returns an array of categories
  }
);
// console.log("");
// fetchcategores();

const categorysectionSlice = createSlice({
  name: "categories",
  initialState: {
    categories: [], // Default state
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchcategores.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchcategores.fulfilled, (state, action) => {
        state.status = "succeeded";
        // console.log(action.payload);
        state.categories = action.payload;
      })
      .addCase(fetchcategores.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default categorysectionSlice.reducer;
