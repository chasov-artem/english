import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "favorites";

const loadFavorites = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveFavorites = (favorites) => {
  try {
    if (favorites.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }
  } catch {}
};

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: loadFavorites(),
  },
  reducers: {
    addFavorite(state, { payload: id }) {
      if (!state.items.includes(id)) {
        state.items.push(id);
        saveFavorites(state.items);
      }
    },
    removeFavorite(state, { payload: id }) {
      state.items = state.items.filter((x) => x !== id);
      saveFavorites(state.items);
    },
    toggleFavorite(state, { payload: id }) {
      if (state.items.includes(id)) {
        state.items = state.items.filter((x) => x !== id);
      } else {
        state.items.push(id);
      }
      saveFavorites(state.items);
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
