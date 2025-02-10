import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { sdk } from "@/lib/config";
import { useSelector } from "react-redux";

// Thunk to fetch points by owner ID
export const fetchPointsByOwnerId = createAsyncThunk(
  "points/fetchByOwnerId",
  async ({ ownerId }, { rejectWithValue }) => {
    const headers = await getAuthHeaders();

    if (!ownerId) {
      return rejectWithValue("Owner ID is required");
    }

    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/get-point-by-owner-id/${ownerId}`,
        {
          headers: {
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
            ...headers,
          },
        }
      );
      // console.log(response.data );
      return response.data; // Return points data
    } catch (error) {
      console.error("Error fetching points:", error);
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const pointSlice = createSlice({
  name: "points",
  initialState: {
    points: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPointsState: (state) => {
      state.points = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPointsByOwnerId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPointsByOwnerId.fulfilled, (state, action) => {
        state.loading = false;
        state.points = action.payload;
      })
      .addCase(fetchPointsByOwnerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPointsState } = pointSlice.actions;
export default pointSlice.reducer;
