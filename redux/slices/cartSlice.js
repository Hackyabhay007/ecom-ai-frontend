import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  items: [],
};

// Function to load items from localStorage
const loadItemsFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const savedItems = localStorage.getItem("_medusa_cart_data");
    if (savedItems) {
      return JSON.parse(savedItems);
    }
  }
  return [];
};

// Initially load items from localStorage (live syncing happens with actions)
initialState.items = loadItemsFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action to add item to cart
    addToCartoncaches(state, action) {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("_medusa_cart_data", JSON.stringify(state.items));
      }
    },
    // Action to remove item from cart
    removeFromCart(state, action) {
      state.items = Array.isArray(state.items) ? state.items.filter((item) => item.id !== action.payload.id) : [];
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("_medusa_cart_data", JSON.stringify(state.items));
      }
    },
    // Action to update the quantity of an item
    updateQuantity(state, action) {
      const { id, quantity } = action.payload;
      const item = Array.isArray(state.items) ? state.items.find((item) => item.id === id) : null;
      if (item) {
        item.quantity = quantity;
      }
      // Save to localStorage
      // if (typeof window !== "undefined") {
      //   localStorage.setItem("_medusa_cart_data", JSON.stringify(state.items));
      // }
    },
    
    // Action to update the entire cart
    updateCart(state, action) {
      state.items = action.payload;
      // Save to localStorage
      if (typeof window !== "undefined") {
      localStorage.setItem("_medusa_cart_data", JSON.stringify(state.items));
      }
    },
    // Action to clear the cart
    clearCart(state) {
      state.items = [];
      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("_medusa_cart_data", JSON.stringify(state.items));
      }
    },
    // Action to re-sync the state with the localStorage data
    syncWithLocalStorage(state) {
      state.items = loadItemsFromLocalStorage();
    }
  },
});

export const { addToCartoncaches, removeFromCart, updateQuantity, clearCart, syncWithLocalStorage } = cartSlice.actions;
export default cartSlice.reducer;
