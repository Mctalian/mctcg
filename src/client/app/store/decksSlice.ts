import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck } from "../../lib/deck.interface";

interface DecksState {
  decks: Deck[]
}

const initialState: DecksState = {
  decks: []
};

export const decksSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    addDeck: (state, action: PayloadAction<Deck>) => {
      if (!state.decks?.find((d) => d.name === action.payload.name)) {
        state.decks.push(action.payload)
      }
    },
    removeDeck: (state, action: PayloadAction<string>) => {
      state.decks = state.decks.filter((d) => d.name !== action.payload);
    },
    duplicateDeck: (state, action: PayloadAction<Deck>) => {
      const newDeck = action.payload;
      newDeck.name = `Copy ${newDeck.name}`;
      state.decks = [...state.decks, newDeck];
    },
  }
});

export const initialDecksState = initialState;

export const { addDeck, removeDeck, duplicateDeck } = decksSlice.actions;

export default decksSlice.reducer;
