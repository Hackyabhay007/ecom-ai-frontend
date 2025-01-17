import { configureStore, combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import wishReducer from "./slices/wishSlice";
import heroSectionReducer from "./slices/herosectionSlice"; // Import the new reducer
import highlightsectionslice from "./slices/hightlightSlice";
import catalogsectionSlice from './slices/catalogSlicer'
import productonhomesectionSlice from './slices/productonhomeSlicer'
import reviewsectionSlice from './slices/reviewSlicer.js'
import featuredsectionSlice from './slices/featuredSlicer.js'
import categorysectionSlice from './slices/categorySlice'
import productSlice from './slices/productSlice'
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Using localStorage
import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";

// Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "wishlist", ], // Specify reducers to persist
};

// Combine reducers
const rootReducer = combineReducers({
  cart: cartReducer,
  wishlist: wishReducer,
  heroSection: heroSectionReducer, // Add the new reducer here
  highlightSection: highlightsectionslice,
  catalogSection : catalogsectionSlice,
  productonhomesection : productonhomesectionSlice,
  reviewsection : reviewsectionSlice,
  featuredection : featuredsectionSlice,
  categorysection : categorysectionSlice,
  products : productSlice
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
