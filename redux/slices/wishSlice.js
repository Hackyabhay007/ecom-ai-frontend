import { createSlice } from "@reduxjs/toolkit";
import { useRouter } from "next/router"; // Import useRouter for navigation

const initialState = {
  wishlist: [],
  isOpen: false,
};

const wishSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const { product, currentCustomer } = action.payload;
      

     
      if (product) {
        product.forEach((product) => {
          const productExists = state.wishlist.find(
            (item) => item.id === product.id
          );
          if (!productExists) state.wishlist.push(product);
        });
      }
    },
    removeFromWishlist: (state, action) => {
      const { productId, currentCustomer } = action.payload;
      


      console.log(action.payload, "action.payload");
      state.wishlist = state.wishlist.filter((item) => item.id !== productId);
    },
    toggleWishlistSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlistSidebar } =
  wishSlice.actions;
export default wishSlice.reducer;
