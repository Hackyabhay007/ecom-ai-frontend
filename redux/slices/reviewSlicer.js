import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Image from "next/image";
import axios from "axios";

// Async action to fetch review data
export const fetchreviews = createAsyncThunk(
  "reviews/fetchreviews",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/review`,
      {
        headers: {
          "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
        },
      }
    ); // Replace with your API endpoint
    // console.log(
    //   response.data.reviews,
    //   " this is get rescome from review"
    // );
    return response.data.reviews; // Assume the API returns an array of reviews
  }
);

const reviewsectionSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [], // Default state
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchreviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchreviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload;
      })
      .addCase(fetchreviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default reviewsectionSlice.reducer;
