import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import reviewReducer from "./slices/reviewSlice";
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
import ordersSlice from './slices/orderSlice';
import interestedProductsSlice from './slices/intrestedSlice';
import pointSlice from './slices/pointSlice';

// Import the new customer reducer
import authSlicer from './slices/authSlice'; // Assuming you saved the previous artifact as customerSlice.js

// Import the new home category reducer
import homeCategoryReducer from './slices/homeCategorySlice';

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
  wishlist: wishReducer,
  heroSection: heroSectionReducer,
  highlightSection: highlightsectionslice,
  catalogSection: catalogsectionSlice,
  productonhomesection: productonhomesectionSlice,
  reviewsection: reviewsectionSlice,
  featuredection: featuredsectionSlice,
  categorysection: categorysectionSlice,
  homeCategories: homeCategoryReducer, // Add the new reducer
  products: productSlice,
  collection: collectionsectionSlice,
  customer: authSlicer , // Add the customer reducer
  orders: ordersSlice,
  points: pointSlice,
  reviews: reviewReducer,
  interestedProducts: interestedProductsSlice,
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

