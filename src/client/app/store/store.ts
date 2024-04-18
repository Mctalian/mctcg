import { configureStore } from "@reduxjs/toolkit";
import loadingSlice, { initialLoadingState } from "./loadingSlice";
import deckSlice, { initialDeckState } from "./deckSlice";
import pdfSlice, { initialPdfState } from "./pdfSlice";

type State = {
  deck: typeof initialDeckState,
  loading: typeof initialLoadingState,
  pdf: typeof initialPdfState,
};

let preloadedState: State = {
  deck: initialDeckState,
  loading: initialLoadingState,
  pdf: initialPdfState,
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
  },
});


store.subscribe(() => {
  const state = { ...store.getState() };
  delete state.loading;
  delete state.pdf;
  localStorage.setItem('store', JSON.stringify(state));
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
