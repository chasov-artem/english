import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import favoritesReducer from "./favoritesSlice";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

const rootReducer = combineReducers({
  auth: authReducer,
  favorites: favoritesReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["favorites"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }),
});

export const persistor = persistStore(store);

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthInitialized = (state) => state.auth.initialized;
export const selectFavorites = (state) => state.favorites.items;
