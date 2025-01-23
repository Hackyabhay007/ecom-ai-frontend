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
import heroSectionReducer from "./slices/herosectionSlice";
import highlightsectionslice from "./slices/hightlightSlice";
import catalogsectionSlice from './slices/catalogSlicer';
import productonhomesectionSlice from './slices/productonhomeSlicer';
import reviewsectionSlice from './slices/reviewSlicer.js';
import featuredsectionSlice from './slices/featuredSlicer.js';
import categorysectionSlice from './slices/categorySlice';
import productSlice from './slices/productSlice';
import collectionsectionSlice from './slices/collectionSlice';

// Import the new customer reducer
import authSlicer from './slices/authSlice'; // Assuming you saved the previous artifact as customerSlice.js

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: [
    "cart", 
    "wishlist", 
    "customer" // Add customer to persisted reducers if needed
  ],
};

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishReducer,
  heroSection: heroSectionReducer,
  highlightSection: highlightsectionslice,
  catalogSection: catalogsectionSlice,
  productonhomesection: productonhomesectionSlice,
  reviewsection: reviewsectionSlice,
  featuredection: featuredsectionSlice,
  categorysection: categorysectionSlice,
  products: productSlice,
  collection: collectionsectionSlice,
  customer: authSlicer // Add the customer reducer
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

