import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const COOKIE_KEY = "interested_products";
const MAX_ITEMS = 10;

const getInitialState = () => {
  const cookieData = Cookies.get(COOKIE_KEY);
  return cookieData ? JSON.parse(cookieData) : [];
};

const saveToCookies = (state) => {
  Cookies.set(COOKIE_KEY, JSON.stringify(state), { expires: 7 });
};

const interestedProductsSlice = createSlice({
  name: "interestedProducts",
  initialState: getInitialState(),
  reducers: {
    addProduct: (state, action) => {
      const { id } = action.payload;
        // Ensure state is an array
      
      console.log("Adding product", id);

    // Ensure state is an array
    if (!Array.isArray(state)) {
      state = [];
    }
      
      // Check if product already exists
      const exists = state.find((product) => product.id === id);
      if (exists) return;
      
      // FIFO - Remove oldest if limit is exceeded
      if (state.length >= MAX_ITEMS) {
        state.shift();
      }
      
      state.push(action.payload);
      saveToCookies(state);
    },
    removeProduct: (state, action) => {
      const newState = state.filter((product) => product.id !== action.payload);
      saveToCookies(newState);
      return newState;
    },
    clearProducts: (state) => {
      saveToCookies([]);
      return [];
    },
  },
});

export const { addProduct, removeProduct, clearProducts } = interestedProductsSlice.actions;
export default interestedProductsSlice.reducer;

