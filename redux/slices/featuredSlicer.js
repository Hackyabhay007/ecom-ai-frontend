import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async action to fetch featured data
export const fetchfeatureds = createAsyncThunk(
  "featureds/fetchfeatureds",
  async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/featured`,
      {
        headers: {
          "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
        },
      }
    ); // Replace with your API endpoint
    // console.log(response.data.featureds, " this is get rescome from featured");
    return response.data.featureds; // Assume the API returns an array of featureds
  }
);
// // console.log("")
fetchfeatureds();

const featuredsectionSlice = createSlice({
  name: "featureds",
  initialState: {
    featureds: [], // Default state
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchfeatureds.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchfeatureds.fulfilled, (state, action) => {
        state.status = "succeeded";
        // // console.log(action.payload);
        state.featureds = action.payload;
      })
      .addCase(fetchfeatureds.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default featuredsectionSlice.reducer;
