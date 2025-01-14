import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Image from "next/image";
import axios from "axios";

// Async action to fetch hero data
export const fetchHeroes = createAsyncThunk("heroes/fetchHeroes", async () => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/heros`,
    {
      headers: {
        "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
      },
    }
  ); // Replace with your API endpoint
  // // console.log(response, " this is get res");
  return response.data.heroes; // Assume the API returns an array of heroes
});

const herosectionSlice = createSlice({
  name: "heroes",
  initialState: {
    heroes: [], // Default state
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchHeroes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.heroes = action.payload;
      })
      .addCase(fetchHeroes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default herosectionSlice.reducer;
