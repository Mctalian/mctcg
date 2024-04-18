import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PdfState {
  blob?: Blob;
  error?: string;
}

const initialState: PdfState = {};

export const pdfSlice = createSlice({
  name: 'pdf',
  initialState,
  reducers: {
    setPdf: (state, action: PayloadAction<PdfState>) => {
      state.blob = action.payload.blob;
      state.error = action.payload.error;
    }
  }
});

export const initialPdfState = initialState;

export const { setPdf } = pdfSlice.actions;

export default pdfSlice.reducer;
