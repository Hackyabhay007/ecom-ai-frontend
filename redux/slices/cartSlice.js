import { createSlice } from "@reduxjs/toolkit";

// Only access localStorage on the client side
let initialState = {
  items: [],
};

// Check if the code is running on the client side before accessing localStorage
if (typeof window !== "undefined") {
  const savedItems = localStorage.getItem("cartItems");
  if (savedItems) {
    initialState.items = JSON.parse(savedItems);
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }

      // Save to localStorage, but only on the client side
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    removeFromCart(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload.id);

      // Save to localStorage, but only on the client side
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = state.items.find((item) => item.id === id);
      if (item) {
        item.quantity = quantity;
      }

      // Save to localStorage, but only on the client side
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    clearCart(state) {
      state.items = [];

      // Save to localStorage, but only on the client side
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
