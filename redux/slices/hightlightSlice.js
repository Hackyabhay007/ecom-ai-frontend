import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Image from "next/image";
import axios from "axios";

// Async action to fetch hero data
export const fetchhightlight = createAsyncThunk(
  "hightlight/fetchhightlight",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/highlight`,
      {
        headers: {
          "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
        },
      }
    ); // Replace with your API endpoint
    // // console.log(response.data.highlights, " this is get res");
    return response.data.highlights; // Assume the API returns an array of hightlight
  }
);

const highlightsectionslice = createSlice({
  name: "hightlight",
  initialState: {
    hightlight: [], // Default state
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchhightlight.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchhightlight.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.hightlight = action.payload;
      })
      .addCase(fetchhightlight.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default highlightsectionslice.reducer;
