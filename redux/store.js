import { configureStore } from "@reduxjs/toolkit";
import exampleReducer from "./slices/exampleSlice"; // Ensure the path is correct

const store = configureStore({
  reducer: {
    example: exampleReducer, // Add your reducer(s) here
  },
});

export default store;
