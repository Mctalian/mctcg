"use client";

import React from "react";
import { Provider } from "react-redux";
import Image from "next/image";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { red, yellow } from "@mui/material/colors";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import { store } from "./store";
import PageContentStateMachine from "./PageContentStateMachine";
import Loader from "./Loader";
import Footer from "./Footer";


const darkTheme = createTheme({
  palette: {
    primary: red,
    secondary: yellow,
    mode: 'dark',
  },
});

export default function Page() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Provider store={store}>
          <Loader />
          <AppBar position="static">
            <Toolbar>
              <Image src="/pdeckf.png" alt="PDeckF Logo" width={40} height={40} />
              <a href="/" style={{ textDecoration: "none", color: "white" }}>
                <Typography variant="h6" component="div" sx={{ margin: "0 1rem" }}>
                  PDeckF
                </Typography>
              </a>
            </Toolbar>
          </AppBar>
          <PageContentStateMachine />
          <Footer />
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
