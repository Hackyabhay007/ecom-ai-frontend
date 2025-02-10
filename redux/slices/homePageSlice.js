import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHeroSection = createAsyncThunk(
  "hero/fetchSection",
  async () => {
    try {
      const response = await fetch("http://localhost:9000/homepage-sections?section_type=hero");
      const data = await response.json();
      console.log("Thisis the whole Hero Section data:", data);
      return data?.data?.sections[0];
    } catch (error) {
      console.error("Error fetching hero section:", error);
      throw Error("Failed to fetch hero section");
    }
  }
);

// Add new fetch function for woman section
export const fetchWomanSection = createAsyncThunk(
  "hero/fetchWomanSection",
  async () => {
    try {
      const response = await fetch("http://localhost:9000/homepage-sections?section_type=woman");
      const data = await response.json();
      console.log("Woman Section data:", data);
      return data?.data?.sections[0];
    } catch (error) {
      console.error("Error fetching woman section:", error);
      throw Error("Failed to fetch woman section");
    }
  }
);

const heroSlice = createSlice({
  name: "hero",
  initialState: {
    heroSection: null,
    womanSection: null, // Add new state property
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Existing hero section cases
      .addCase(fetchHeroSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroSection.fulfilled, (state, action) => {
        state.loading = false;
        state.heroSection = action.payload;
      })
      .addCase(fetchHeroSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch hero section";
      })
      // Add new cases for woman section
      .addCase(fetchWomanSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWomanSection.fulfilled, (state, action) => {
        state.loading = false;
        state.womanSection = action.payload;
      })
      .addCase(fetchWomanSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch woman section";
      });
  },
});

export default heroSlice.reducer;