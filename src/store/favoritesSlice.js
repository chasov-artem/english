import { createSlice } from "@reduxjs/toolkit";

const favoritesSlice = createSlice({
  name: "favorites",
  initialState: {
    items: [],
  },
  reducers: {
    addFavorite(state, { payload: id }) {
      if (!state.items.includes(id)) {
        state.items.push(id);
      }
    },
    removeFavorite(state, { payload: id }) {
      state.items = state.items.filter((x) => x !== id);
    },
    toggleFavorite(state, { payload: id }) {
      if (state.items.includes(id)) {
        state.items = state.items.filter((x) => x !== id);
      } else {
        state.items.push(id);
      }
    },
  },
});

export const { addFavorite, removeFavorite, toggleFavorite } =
  favoritesSlice.actions;
export default favoritesSlice.reducer;
