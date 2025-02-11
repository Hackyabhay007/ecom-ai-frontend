import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Image from "next/image";
import axios from "axios";

// Async action to fetch productonhome data
export const fetchproductonhomes = createAsyncThunk(
  "productonhomes/fetchproductonhomes",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-on-home`,
      {
        headers: {
          "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
        },
      }
    ); // Replace with your API endpoint
    // console.log(
    //   response.data.showonhome,
    //   " this is get rescome from productonhome"
    // );
    return response.data.showonhome; // Assume the API returns an array of productonhomes
  }
);

const productonhomesectionSlice = createSlice({
  name: "productonhomes",
  initialState: {
    productonhomes: [], // Default state
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchproductonhomes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchproductonhomes.fulfilled, (state, action) => {
        state.status = "succeeded";
        // // console.log(action.payload);
        state.productonhomes = action.payload;
      })
      .addCase(fetchproductonhomes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default productonhomesectionSlice.reducer;
