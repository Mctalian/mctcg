import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deck } from "../../lib/deck.interface";
import { numberToString } from "pdf-lib";

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
    updateDeck: (state, action: PayloadAction<{ deckIndex: number, deck: Deck}>) => {
      let earlyDecks = [];
      let lateDecks = [];
      const indexToUpdate = action.payload.deckIndex;
      if (indexToUpdate > 0) {
        earlyDecks = state.decks.slice(0, indexToUpdate - 1);
      }
      if (indexToUpdate < state.decks.length) {
        lateDecks = state.decks.slice(indexToUpdate + 1);
      }
      const updatedDeck = action.payload.deck;
      state.decks = [...earlyDecks, updatedDeck, ...lateDecks];
    },
    removeDeck: (state, action: PayloadAction<string>) => {
      state.decks = state.decks.filter((d) => d.name !== action.payload);
    },
    duplicateDeck: (state, action: PayloadAction<Deck>) => {
      const newDeck = action.payload;
      newDeck.name = `Copy ${newDeck.name}`;
      state.decks = [...state.decks, newDeck];
    },
    renameDeck: (state, action: PayloadAction<{ deckIndex: number, newName: string }>) => {
      let earlyDecks = [];
      let lateDecks = [];
      const indexToUpdate = action.payload.deckIndex;
      if (indexToUpdate > 0) {
        earlyDecks = state.decks.slice(0, indexToUpdate - 1);
      }
      if (indexToUpdate < state.decks.length) {
        lateDecks = state.decks.slice(indexToUpdate + 1);
      }
      const renamedDeck = { ...state.decks[indexToUpdate], name: action.payload.newName };
      state.decks = [...earlyDecks, renamedDeck, ...lateDecks];
    }
  }
});

export const initialDecksState = initialState;

export const { addDeck, removeDeck, duplicateDeck, renameDeck, updateDeck } = decksSlice.actions;

export default decksSlice.reducer;
