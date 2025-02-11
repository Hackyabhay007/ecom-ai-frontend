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

      //   // console.log(region.id)

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products`,
        {
          params: {
            limit,
            offset,
            region_id: region.id,
            fields: "*variants.calculated_price",
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

      const Promotionres = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/promotion`,
        {
          headers: {
            "Content-Type": "application/json",
            "x-publishable-api-key": `${process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY}`,
          },
        }
      );

      // console.log(Promotionres.data.promotion, "Promotion");
      const promotion = Promotionres.data.promotion;

      // Function to map target rule value with product id and add discountable flag
      function applyDiscountToProduct(targetRules, products) {
        // Extract the discount value from target rules
        const discountValue = targetRules.value;

        // Loop through each product and check if its id matches any target value
        products.forEach((product) => {
          targetRules.target_rules[0].values.forEach((rule) => {
            if (product.id === rule.value) {
              // Ensure product metadata exists and create the discount field if it doesn't
              if (!product.metadata) {
                product.metadata = {}; // Create an empty metadata object if it doesn't exist
              }
              if (!product.metadata.discount) {
                product.metadata.discount = 0; // Set the default discount value if not present
              }

              // Apply the discount to the product's metadata
              product.metadata.discount = discountValue;
              product.discountable = true; // Ensure the product is marked as discountable
              // console.log(`Discount applied to product: ${product.title}`);
            }
          });
        });

        return products;
      }

      // Apply discount based on target rules
      const updatedProducts = promotion[0]?.application_method
        ? applyDiscountToProduct(promotion[0].application_method, products)
        : products;

      return { products: updatedProducts, count, nextPage, queryParams };
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
