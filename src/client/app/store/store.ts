import { configureStore } from "@reduxjs/toolkit";
import loadingSlice, { initialLoadingState } from "./loadingSlice";
import deckSlice, { initialDeckState } from "./deckSlice";
import pdfSlice, { initialPdfState } from "./pdfSlice";
import playerInfoSlice, { initialPlayerInfoState } from "./playerInfoSlice";

type State = {
  deck: typeof initialDeckState,
  loading: typeof initialLoadingState,
  pdf: typeof initialPdfState,
  playerInfo: typeof initialPlayerInfoState,
};

let preloadedState: State = {
  deck: initialDeckState,
  loading: initialLoadingState,
  pdf: initialPdfState,
  playerInfo: initialPlayerInfoState,
};
if (typeof window !== 'undefined') {
  // Perform localStorage action
  preloadedState = { 
    ...JSON.parse(localStorage.getItem('store')),
    loading: initialLoadingState,
    pdf: initialPdfState,
  };
}

export const store = configureStore({
  preloadedState: preloadedState,
  reducer: {
    deck: deckSlice,
    loading: loadingSlice,
    pdf: pdfSlice,
    playerInfo: playerInfoSlice,
  },
});


store.subscribe(() => {
  const state = { ...store.getState() };
  delete state.loading;
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
