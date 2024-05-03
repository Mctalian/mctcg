import { configureStore } from "@reduxjs/toolkit";
import loadingSlice, { initialLoadingState } from "./loadingSlice";
import deckSlice, { initialDeckState } from "./deckSlice";
import pdfSlice, { initialPdfState } from "./pdfSlice";
import playerInfoSlice, { initialPlayerInfoState } from "./playerInfoSlice";
import decksSlice, { initialDecksState } from "./decksSlice";
import successSlice, { initialSuccessState } from "./successSlice";
import displayPreferencesSlice, { initialDisplayPreferencesState } from "./displayPreferencesSlice";

type State = {
  deck: typeof initialDeckState,
  decks: typeof initialDecksState,
  displayPreferences: typeof initialDisplayPreferencesState,
  loading: typeof initialLoadingState,
  pdf: typeof initialPdfState,
  playerInfo: typeof initialPlayerInfoState,
  success: typeof initialSuccessState,
};

let preloadedState: State = {
  deck: initialDeckState,
  decks: initialDecksState,
  displayPreferences: initialDisplayPreferencesState,
  loading: initialLoadingState,
  pdf: initialPdfState,
  playerInfo: initialPlayerInfoState,
  success: initialSuccessState,
};
if (typeof window !== 'undefined') {
  // Perform localStorage action
  preloadedState = { 
    ...JSON.parse(localStorage.getItem('store')),
    loading: initialLoadingState,
    success: initialSuccessState,
    pdf: initialPdfState,
  };
}

export const store = configureStore({
  preloadedState: preloadedState,
  reducer: {
    deck: deckSlice,
    decks: decksSlice,
    displayPreferences: displayPreferencesSlice,
    loading: loadingSlice,
    pdf: pdfSlice,
    playerInfo: playerInfoSlice,
    success: successSlice,
  },
});


store.subscribe(() => {
  const state = { ...store.getState() };
  delete state.loading;
  delete state.success;
  delete state.pdf;
  const deck = { ...state.deck }
  delete deck.name;
  const newState = {
    ...state,
    deck: { ...deck }
  }
  localStorage.setItem('store', JSON.stringify(newState));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
