import { configureStore, combineReducers } from "@reduxjs/toolkit"; // Import combineReducers from Redux Toolkit
import cartReducer from "./slices/cartSlice";
import wishReducer from "./slices/wishSlice";
import homePageReducer from "./slices/homePageSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Using localStorage

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist"], // Specify which reducers to persist
};

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishReducer, // Add wishlist to the combined reducers
  homePage: homePageReducer,
});

// Persist the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
});

// Persistor
export const persistor = persistStore(store);
