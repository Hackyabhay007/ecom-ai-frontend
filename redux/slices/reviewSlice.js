import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { getAuthHeaders } from "@/lib/data/cookies";

const BASE_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY; // Ensure this is set in .env

// Helper function to get headers
const getHeaders = async () => {
  const authHeaders = await getAuthHeaders();
  return {
    ...authHeaders,
    "x-publishable-api-key": PUBLISHABLE_API_KEY,
  };
};

// Fetch reviews
export const fetchReviews = createAsyncThunk("reviews/fetchAll", async () => {
  const headers = await getHeaders();
  const response = await axios.get(`${BASE_URL}/store/review`, { headers });
  return response.data;
});

// Add a review
export const addReview = createAsyncThunk("reviews/add", async (reviewData) => {
  const headers = await getHeaders();
  const response = await axios.post(`${BASE_URL}/store/review`, reviewData, { headers });
  console.log(response.data.review);
  return response.data.review;
});

// Update a review
export const updateReview = createAsyncThunk("reviews/update", async ({ id, updatedData }) => {
  const headers = await getHeaders();
  const response = await axios.put(`${BASE_URL}/store/review/${id}`, updatedData, { headers });
  return response.data;
});

// Delete a review
export const deleteReview = createAsyncThunk("reviews/delete", async (id) => {
  const headers = await getHeaders();
  await axios.delete(`${BASE_URL}/store/review/${id}`, { headers });
  return id;
});

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.reviews = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.reviews.push(action.payload);
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        const index = state.reviews.findIndex((review) => review.id === action.payload.id);
        if (index !== -1) {
          state.reviews[index] = action.payload;
        }
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((review) => review.id !== action.payload);
      });
  },
});

export default reviewSlice.reducer;
