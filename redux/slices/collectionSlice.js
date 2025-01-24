import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Image from "next/image";
import axios from "axios";

// Async action to fetch collection data
export const fetchcollections = createAsyncThunk(
  "collections/fetchcollections",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections`,
      {
        params: {
          fields: "*metadata",
        },
        headers: {
          "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
        },
      }
    ); // Replace with your API endpoint
    // console.log(response.data, " this is get rescome from collection");
    return response.data.collections; // Assume the API returns an array of collections
  }
);
// console.log("");
// fetchcollections();

const collectionsectionSlice = createSlice({
  name: "collections",
  initialState: {
    collections: [], // Default state
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchcollections.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchcollections.fulfilled, (state, action) => {
        state.status = "succeeded";
        // console.log(action.payload);
        state.collections = action.payload;
      })
      .addCase(fetchcollections.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default collectionsectionSlice.reducer;
