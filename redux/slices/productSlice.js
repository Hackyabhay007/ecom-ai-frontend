import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { useRegion } from "../../src/contexts/RegionContext.jsx";
import axios from "axios";


// Thunk to fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ pageParam = 1, queryParams, region }, { rejectWithValue }) => {
    try {
      if (!region) {
        throw new Error("Region is not set");
      }

      const limit = queryParams?.limit || 12;
      const offset = (pageParam - 1) * limit;

    //   console.log(region.id)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products`,
        {
          params: {
            limit,
            offset,
            region_id: region.id,
            fields:
              "*variants.calculated_price",
            ...queryParams,
          },
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
          },
        }
      );

      const { products, count } = response.data;
      const nextPage = count > offset + limit ? pageParam + 1 : null;

      return { products, count, nextPage, queryParams };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Redux Slice
const productSlice = createSlice({
  name: "products",

  initialState: {
    products: [],
    count: 0,
    nextPage: null,
    status: "idle",
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload.products;
        state.count = action.payload.count;
        state.nextPage = action.payload.nextPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default productSlice.reducer;
