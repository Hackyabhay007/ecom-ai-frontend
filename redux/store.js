import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Import existing reducers
import cartReducer from "./slices/cartSlice";
import wishReducer from "./slices/wishSlice";
import homePageReducer from "./slices/homePageSlice";
import authReducer from "./slices/authSlice"; // Add this import
import shopReducer from './slices/shopSlice';
import reviewReducer from './slices/reviewSlice';
import wishlistReducer from './slices/wishlistSlice';
import productReducer from './slices/productSlice';
import categoryReducer from './slices/categorySlice';
import collectionReducer from './slices/collectionSlice';

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "wishlist", 
    "customer" ,
    "orders",
  ],
};

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  // wishlist: wishReducer, // Add wishlist to the combined reducers
  homePage: homePageReducer,
  auth: authReducer, // Add this line
  shop: shopReducer,
  reviews: reviewReducer,
  cart: cartReducer,
  wishlist: wishlistReducer, // Add this line
  products: productReducer,
  categories: categoryReducer,
  collection: collectionReducer,
});

// Persist the combined reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Persistor
export const persistor = persistStore(store);

