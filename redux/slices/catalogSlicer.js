import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Image from "next/image";
import axios from "axios";

// Async action to fetch catalog data
export const fetchcataloges = createAsyncThunk(
  "cataloges/fetchcataloges",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/catalogs`,
      {
        headers: {
          "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
        },
      }
    ); // Replace with your API endpoint
    // console.log(response.data.catalogs, " this is get rescome from catalog");
    return response.data.catalogs; // Assume the API returns an array of cataloges
  }
);
// console.log("");
// fetchcataloges();

const catalogsectionSlice = createSlice({
  name: "cataloges",
  initialState: {
    cataloges: [], // Default state
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchcataloges.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchcataloges.fulfilled, (state, action) => {
        state.status = "succeeded";
        // console.log(action.payload);
        state.cataloges = action.payload;
      })
      .addCase(fetchcataloges.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default catalogsectionSlice.reducer;
