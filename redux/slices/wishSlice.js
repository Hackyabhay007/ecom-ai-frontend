import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  wishlist: [],
  isOpen: false,
};

const wishSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const productExists = state.wishlist.find(
        (item) => item.id === action.payload.id
      );
      if (!productExists) state.wishlist.push(action.payload);
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter((item) => item.id !== action.payload);
    },
    toggleWishlistSidebar: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { addToWishlist, removeFromWishlist, toggleWishlistSidebar } = wishSlice.actions;
export default wishSlice.reducer;
